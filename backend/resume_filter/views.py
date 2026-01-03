"""
API Views for Resume Filtering

This module provides REST API endpoints for filtering resumes
based on job descriptions using AI similarity matching.
"""
import logging
from typing import List, Dict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .services.pdf_extractor import PDFExtractor
from .services.similarity_service import SimilarityService

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class FilterResumesView(APIView):
    """
    API endpoint to filter resumes based on job description.
    
    Accepts:
    - Multiple PDF files (field: 'resumes')
    - Job description text (field: 'job_description')
    
    Returns:
    - JSON response with filtered and ranked resumes (similarity >= 70%)
    """
    parser_classes = (MultiPartParser, FormParser)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.pdf_extractor = PDFExtractor()
        self.similarity_service = SimilarityService()
    
    def post(self, request, *args, **kwargs):
        """
        Process resume filtering request.
        
        Expected request data:
        - resumes: List of PDF files
        - job_description: String containing job description
        
        Returns:
        - 200: Success with filtered resumes
        - 400: Bad request (missing files or job description)
        - 500: Server error
        """
        try:
            # Validate request data
            validation_error = self._validate_request(request)
            if validation_error:
                return Response(
                    {'error': validation_error, 'message': validation_error},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get files and job description
            resume_files = request.FILES.getlist('resumes')
            job_description = request.data.get('job_description', '').strip()
            
            logger.info(f"Processing {len(resume_files)} resumes for filtering")
            
            # Extract text from all PDFs
            resumes_data = []
            for resume_file in resume_files:
                try:
                    # Validate PDF
                    if not self.pdf_extractor.validate_pdf(resume_file):
                        logger.warning(f"Invalid PDF file: {resume_file.name}")
                        continue
                    
                    # Extract text
                    text = self.pdf_extractor.extract_text(resume_file)
                    
                    # Log extracted text length for debugging
                    text_length = len(text) if text else 0
                    logger.info(f"Extracted {text_length} characters from {resume_file.name}")
                    
                    if text_length < 50:
                        logger.warning(f"Very short text extracted from {resume_file.name} ({text_length} chars)")
                    
                    resumes_data.append({
                        'name': resume_file.name,
                        'text': text
                    })
                    logger.debug(f"Extracted text from {resume_file.name}: {text[:200]}..." if len(text) > 200 else f"Extracted text from {resume_file.name}: {text}")
                    
                except Exception as e:
                    logger.error(f"Error processing {resume_file.name}: {str(e)}")
                    continue
            
            if not resumes_data:
                error_msg = 'No valid resumes could be processed'
                return Response(
                    {'error': error_msg, 'message': error_msg},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get similarity threshold from settings or use default (50%)
            # Note: Semantic similarity scores are typically lower than exact matches
            threshold = getattr(settings, 'RESUME_SIMILARITY_THRESHOLD', 0.50)
            
            # Rank and filter resumes
            ranked_resumes = self.similarity_service.rank_resumes(
                resumes_data,
                job_description,
                threshold=threshold
            )
            
            # Prepare response
            response_data = {
                'total_resumes': len(resume_files),
                'processed_resumes': len(resumes_data),
                'filtered_resumes': len(ranked_resumes),
                'threshold': threshold * 100,
                'resumes': [
                    {
                        'filename': resume['name'],
                        'similarity_score': resume['similarity_score']
                    }
                    for resume in ranked_resumes
                ]
            }
            
            logger.info(
                f"Filtering complete: {len(ranked_resumes)}/{len(resumes_data)} "
                f"resumes above {threshold*100}% threshold"
            )
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Unexpected error in filter_resumes: {str(e)}", exc_info=True)
            error_msg = 'An internal server error occurred. Please try again later.'
            return Response(
                {'error': error_msg, 'message': error_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _validate_request(self, request) -> str:
        """
        Validate the incoming request.
        
        Args:
            request: Django request object
            
        Returns:
            str: Error message if validation fails, None otherwise
        """
        # Check if files are present
        if 'resumes' not in request.FILES:
            return 'No resume files provided. Please upload at least one PDF file.'
        
        resume_files = request.FILES.getlist('resumes')
        if not resume_files:
            return 'No resume files provided. Please upload at least one PDF file.'
        
        # Check if job description is present
        job_description = request.data.get('job_description', '').strip()
        if not job_description:
            return 'Job description is required.'
        
        if len(job_description) < 10:
            return 'Job description must be at least 10 characters long.'
        
        # Validate file types
        for resume_file in resume_files:
            if not resume_file.name.lower().endswith('.pdf'):
                return f'Invalid file type: {resume_file.name}. Only PDF files are allowed.'
            
            # Check file size (max 10MB per file)
            max_size = 10 * 1024 * 1024  # 10MB
            if resume_file.size > max_size:
                return f'File too large: {resume_file.name}. Maximum size is 10MB.'
        
        return None

