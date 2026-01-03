"""
Tests for the resume filter application.
"""
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from resume_filter.services.pdf_extractor import PDFExtractor
from resume_filter.services.similarity_service import SimilarityService


class PDFExtractorTestCase(TestCase):
    """Test cases for PDF extraction."""
    
    def test_validate_pdf(self):
        """Test PDF validation."""
        # Create a mock PDF file
        pdf_content = b'%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\nxref\n0 0\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF'
        pdf_file = SimpleUploadedFile("test.pdf", pdf_content, content_type="application/pdf")
        
        extractor = PDFExtractor()
        self.assertTrue(extractor.validate_pdf(pdf_file))
    
    def test_validate_invalid_file(self):
        """Test validation of non-PDF file."""
        text_file = SimpleUploadedFile("test.txt", b"This is not a PDF", content_type="text/plain")
        
        extractor = PDFExtractor()
        self.assertFalse(extractor.validate_pdf(text_file))


class SimilarityServiceTestCase(TestCase):
    """Test cases for similarity service."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.similarity_service = SimilarityService()
    
    def test_calculate_similarity(self):
        """Test similarity calculation."""
        resume_text = "Experienced software engineer with Python and Django expertise."
        job_description = "Looking for a Python Django developer with 5+ years experience."
        
        similarity = self.similarity_service.calculate_similarity(resume_text, job_description)
        
        # Similarity should be between 0 and 1
        self.assertGreaterEqual(similarity, 0)
        self.assertLessEqual(similarity, 1)
        # Should have some similarity for related texts
        self.assertGreater(similarity, 0.3)
    
    def test_rank_resumes(self):
        """Test resume ranking."""
        resumes = [
            {'name': 'resume1.pdf', 'text': 'Python developer with Django experience'},
            {'name': 'resume2.pdf', 'text': 'Marketing specialist with social media skills'},
            {'name': 'resume3.pdf', 'text': 'Senior Python engineer with 10 years Django experience'},
        ]
        job_description = "Looking for a Python Django developer"
        
        ranked = self.similarity_service.rank_resumes(resumes, job_description, threshold=0.3)
        
        # Should return resumes above threshold
        self.assertGreater(len(ranked), 0)
        # Should be sorted by similarity (descending)
        if len(ranked) > 1:
            self.assertGreaterEqual(ranked[0]['similarity_score'], ranked[1]['similarity_score'])



