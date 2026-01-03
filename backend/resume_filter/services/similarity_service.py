"""
AI Similarity Service

This module provides functionality to compare resumes with job descriptions
using AI/ML models for semantic similarity.
"""
import logging
import re
from typing import List, Dict, Tuple
import os
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)


class SimilarityService:
    """Service for calculating semantic similarity between resumes and job descriptions."""
    
    # Model name - using a lightweight but effective model
    DEFAULT_MODEL = 'all-MiniLM-L6-v2'
    
    # Class-level model cache to avoid reloading
    _model_cache = {}
    _model_name_cache = None
    
    def __init__(self, model_name: str = None):
        """
        Initialize the similarity service with a sentence transformer model.
        
        Args:
            model_name: Name of the sentence transformer model to use.
                       Defaults to 'all-MiniLM-L6-v2' (fast and efficient)
        """
        self.model_name = model_name or os.getenv('SIMILARITY_MODEL', self.DEFAULT_MODEL)
        self.model = self._get_or_load_model()
    
    def _get_or_load_model(self):
        """Get model from cache or load it."""
        # Use cached model if same model name
        if self.model_name == SimilarityService._model_name_cache and SimilarityService._model_cache.get(self.model_name):
            logger.debug(f"Using cached model: {self.model_name}")
            return SimilarityService._model_cache[self.model_name]
        
        # Load new model
        try:
            logger.info(f"Loading similarity model: {self.model_name}")
            model = SentenceTransformer(self.model_name)
            SimilarityService._model_cache[self.model_name] = model
            SimilarityService._model_name_cache = self.model_name
            logger.info("Model loaded successfully")
            return model
        except Exception as e:
            logger.error(f"Failed to load model {self.model_name}: {str(e)}")
            raise
    
    @staticmethod
    def _preprocess_text(text: str) -> str:
        """
        Preprocess text for better similarity matching.
        
        Args:
            text: Raw text to preprocess
            
        Returns:
            str: Preprocessed text
        """
        if not text:
            return ""
        
        # Normalize whitespace (multiple spaces/newlines to single space)
        text = re.sub(r'\s+', ' ', text)
        
        # Remove excessive punctuation but keep meaningful ones
        text = re.sub(r'[^\w\s\.\,\;\:\-\'\"\(\)]', ' ', text)
        
        # Normalize whitespace again after punctuation removal
        text = re.sub(r'\s+', ' ', text)
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    @staticmethod
    def _truncate_text(text: str, max_length: int = 2000) -> str:
        """
        Truncate text to maximum length while preserving word boundaries.
        
        Args:
            text: Text to truncate
            max_length: Maximum character length
            
        Returns:
            str: Truncated text
        """
        if len(text) <= max_length:
            return text
        
        # Truncate at word boundary
        truncated = text[:max_length].rsplit(' ', 1)[0]
        logger.warning(f"Text truncated from {len(text)} to {len(truncated)} characters")
        return truncated
    
    def _encode_with_chunking(self, text: str, max_length: int = 2000) -> np.ndarray:
        """
        Encode text with chunking strategy for long documents.
        For very long texts, we use a chunking approach to preserve more information.
        
        Args:
            text: Text to encode
            max_length: Maximum character length per chunk
            
        Returns:
            np.ndarray: Average embedding of all chunks
        """
        # Preprocess text
        processed_text = self._preprocess_text(text)
        
        # If text is short enough, encode directly
        if len(processed_text) <= max_length:
            return self.model.encode(
                processed_text,
                convert_to_numpy=True,
                show_progress_bar=False,
                normalize_embeddings=True  # Normalize for better cosine similarity
            )
        
        # For long texts, split into chunks and average embeddings
        logger.debug(f"Text length {len(processed_text)} exceeds {max_length}, using chunking strategy")
        
        # Split into sentences first (better than arbitrary chunks)
        sentences = re.split(r'[.!?]+\s+', processed_text)
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
            
            # If adding this sentence would exceed max_length, save current chunk
            if len(current_chunk) + len(sentence) + 1 > max_length and current_chunk:
                chunks.append(current_chunk)
                current_chunk = sentence
            else:
                current_chunk = f"{current_chunk} {sentence}".strip() if current_chunk else sentence
        
        # Add remaining chunk
        if current_chunk:
            chunks.append(current_chunk)
        
        if not chunks:
            chunks = [processed_text[:max_length]]
        
        logger.debug(f"Split text into {len(chunks)} chunks")
        
        # Encode each chunk
        chunk_embeddings = []
        for i, chunk in enumerate(chunks):
            try:
                embedding = self.model.encode(
                    chunk,
                    convert_to_numpy=True,
                    show_progress_bar=False,
                    normalize_embeddings=True
                )
                chunk_embeddings.append(embedding)
            except Exception as e:
                logger.warning(f"Error encoding chunk {i+1}: {str(e)}")
                continue
        
        if not chunk_embeddings:
            # Fallback: encode truncated text
            logger.warning("All chunks failed, encoding truncated text")
            truncated = self._truncate_text(processed_text, max_length)
            return self.model.encode(
                truncated,
                convert_to_numpy=True,
                show_progress_bar=False,
                normalize_embeddings=True
            )
        
        # Average the embeddings (mean pooling)
        avg_embedding = np.mean(chunk_embeddings, axis=0)
        
        # Normalize the averaged embedding
        norm = np.linalg.norm(avg_embedding)
        if norm > 0:
            avg_embedding = avg_embedding / norm
        
        return avg_embedding
    
    def calculate_similarity(self, resume_text: str, job_description: str) -> float:
        """
        Calculate similarity score between resume and job description.
        Uses improved encoding strategy for better accuracy with long documents.
        
        Args:
            resume_text: Text content of the resume
            job_description: Job description text
            
        Returns:
            float: Similarity score between 0 and 1 (0 = no similarity, 1 = identical)
        """
        try:
            if not resume_text or not resume_text.strip():
                logger.warning("Empty resume text provided")
                return 0.0
            
            if not job_description or not job_description.strip():
                logger.warning("Empty job description provided")
                return 0.0
            
            # Log text lengths for debugging
            logger.debug(f"Resume text length: {len(resume_text)} chars")
            logger.debug(f"Job description length: {len(job_description)} chars")
            
            # Generate embeddings with improved strategy
            resume_embedding = self._encode_with_chunking(resume_text, max_length=2000)
            job_embedding = self._encode_with_chunking(job_description, max_length=2000)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(
                resume_embedding.reshape(1, -1),
                job_embedding.reshape(1, -1)
            )[0][0]
            
            # Ensure similarity is in valid range [0, 1]
            similarity = max(0.0, min(1.0, float(similarity)))
            
            logger.debug(f"Calculated similarity: {similarity:.4f} ({similarity*100:.2f}%)")
            
            return similarity
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {str(e)}", exc_info=True)
            raise
    
    def rank_resumes(
        self, 
        resumes: List[Dict[str, str]], 
        job_description: str,
        threshold: float = 0.50  # Lowered default threshold for better matching
    ) -> List[Dict]:
        """
        Rank resumes by similarity to job description and filter by threshold.
        
        Args:
            resumes: List of dictionaries with 'name' and 'text' keys
            job_description: Job description text
            threshold: Minimum similarity threshold (0-1). Default 0.50 (50%)
                       Note: Semantic similarity scores are typically lower than exact matches
            
        Returns:
            List[Dict]: Sorted list of resumes with similarity scores >= threshold.
                       Each dict contains 'name', 'text', 'similarity_score'
        """
        if not resumes:
            return []
        
        if not job_description or not job_description.strip():
            logger.warning("Empty job description provided for ranking")
            return []
        
        logger.info(f"Ranking {len(resumes)} resumes against job description (threshold: {threshold*100:.1f}%)")
        
        # Calculate similarity for each resume
        all_scores = []  # Track all scores for logging
        ranked_resumes = []
        
        for resume in resumes:
            try:
                if not resume.get('text') or not resume['text'].strip():
                    logger.warning(f"Resume {resume.get('name', 'unknown')} has empty text")
                    continue
                
                similarity = self.calculate_similarity(resume['text'], job_description)
                score_percentage = round(similarity * 100, 2)
                all_scores.append((resume['name'], score_percentage))
                
                if similarity >= threshold:
                    ranked_resumes.append({
                        'name': resume['name'],
                        'text': resume['text'],
                        'similarity_score': score_percentage
                    })
                    logger.info(f"✓ Resume {resume['name']}: {score_percentage:.2f}% similarity (ABOVE threshold)")
                else:
                    logger.info(f"✗ Resume {resume['name']}: {score_percentage:.2f}% similarity (below threshold)")
                    
            except Exception as e:
                logger.error(f"Error processing resume {resume.get('name', 'unknown')}: {str(e)}", exc_info=True)
                continue
        
        # Sort by similarity score (descending)
        ranked_resumes.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        # Log summary statistics
        if all_scores:
            scores_only = [score for _, score in all_scores]
            avg_score = sum(scores_only) / len(scores_only)
            max_score = max(scores_only)
            min_score = min(scores_only)
            logger.info(
                f"Similarity statistics - Avg: {avg_score:.2f}%, Max: {max_score:.2f}%, "
                f"Min: {min_score:.2f}%, Threshold: {threshold*100:.1f}%"
            )
        
        logger.info(f"Found {len(ranked_resumes)}/{len(resumes)} resumes above {threshold*100:.1f}% threshold")
        
        return ranked_resumes

