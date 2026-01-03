"""
AI Similarity Service

This module provides functionality to compare resumes with job descriptions
using AI/ML models for semantic similarity.
"""
import logging
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
    
    def calculate_similarity(self, resume_text: str, job_description: str) -> float:
        """
        Calculate similarity score between resume and job description.
        
        Args:
            resume_text: Text content of the resume
            job_description: Job description text
            
        Returns:
            float: Similarity score between 0 and 1 (0 = no similarity, 1 = identical)
        """
        try:
            # Generate embeddings
            resume_embedding = self.model.encode(resume_text, convert_to_numpy=True)
            job_embedding = self.model.encode(job_description, convert_to_numpy=True)
            
            # Calculate cosine similarity
            similarity = cosine_similarity(
                resume_embedding.reshape(1, -1),
                job_embedding.reshape(1, -1)
            )[0][0]
            
            # Return similarity as float between 0 and 1
            return float(similarity)
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {str(e)}")
            raise
    
    def rank_resumes(
        self, 
        resumes: List[Dict[str, str]], 
        job_description: str,
        threshold: float = 0.70
    ) -> List[Dict]:
        """
        Rank resumes by similarity to job description and filter by threshold.
        
        Args:
            resumes: List of dictionaries with 'name' and 'text' keys
            job_description: Job description text
            threshold: Minimum similarity threshold (0-1). Default 0.70 (70%)
            
        Returns:
            List[Dict]: Sorted list of resumes with similarity scores >= threshold.
                       Each dict contains 'name', 'text', 'similarity_score'
        """
        if not resumes:
            return []
        
        logger.info(f"Ranking {len(resumes)} resumes against job description")
        
        # Calculate similarity for each resume
        ranked_resumes = []
        for resume in resumes:
            try:
                similarity = self.calculate_similarity(resume['text'], job_description)
                
                if similarity >= threshold:
                    ranked_resumes.append({
                        'name': resume['name'],
                        'text': resume['text'],
                        'similarity_score': round(similarity * 100, 2)  # Convert to percentage
                    })
                    logger.debug(f"Resume {resume['name']}: {similarity*100:.2f}% similarity")
                else:
                    logger.debug(f"Resume {resume['name']}: {similarity*100:.2f}% similarity (below threshold)")
                    
            except Exception as e:
                logger.error(f"Error processing resume {resume.get('name', 'unknown')}: {str(e)}")
                continue
        
        # Sort by similarity score (descending)
        ranked_resumes.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        logger.info(f"Found {len(ranked_resumes)} resumes above {threshold*100}% threshold")
        
        return ranked_resumes

