"""
PDF Text Extraction Service

This module provides functionality to extract text from PDF files.
Supports multiple PDF parsing libraries for robustness.
"""
import logging
from typing import Optional
import pdfplumber
import PyPDF2
from io import BytesIO

logger = logging.getLogger(__name__)


class PDFExtractor:
    """Service for extracting text from PDF files."""
    
    @staticmethod
    def extract_text(pdf_file) -> str:
        """
        Extract text from a PDF file.
        
        Args:
            pdf_file: Django UploadedFile or file-like object
            
        Returns:
            str: Extracted text from the PDF
            
        Raises:
            ValueError: If PDF cannot be read or is corrupted
            Exception: For other PDF processing errors
        """
        try:
            # Try pdfplumber first (better for complex PDFs)
            text = PDFExtractor._extract_with_pdfplumber(pdf_file)
            if text and text.strip():
                return text.strip()
            
            # Fallback to PyPDF2 if pdfplumber fails
            logger.warning(f"pdfplumber extraction returned empty, trying PyPDF2 for {pdf_file.name}")
            text = PDFExtractor._extract_with_pypdf2(pdf_file)
            if text and text.strip():
                return text.strip()
            
            raise ValueError(f"Could not extract text from PDF: {pdf_file.name}")
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF {pdf_file.name}: {str(e)}")
            raise
    
    @staticmethod
    def _extract_with_pdfplumber(pdf_file) -> str:
        """Extract text using pdfplumber library."""
        pdf_file.seek(0)  # Reset file pointer
        text_parts = []
        
        try:
            with pdfplumber.open(BytesIO(pdf_file.read())) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
        except Exception as e:
            logger.warning(f"pdfplumber extraction failed: {str(e)}")
            return ""
        
        return "\n".join(text_parts)
    
    @staticmethod
    def _extract_with_pypdf2(pdf_file) -> str:
        """Extract text using PyPDF2 library as fallback."""
        pdf_file.seek(0)  # Reset file pointer
        text_parts = []
        
        try:
            pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_file.read()))
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        except Exception as e:
            logger.warning(f"PyPDF2 extraction failed: {str(e)}")
            return ""
        
        return "\n".join(text_parts)
    
    @staticmethod
    def validate_pdf(pdf_file) -> bool:
        """
        Validate that the file is a valid PDF.
        
        Args:
            pdf_file: Django UploadedFile or file-like object
            
        Returns:
            bool: True if valid PDF, False otherwise
        """
        try:
            pdf_file.seek(0)
            header = pdf_file.read(4)
            pdf_file.seek(0)
            return header == b'%PDF'
        except Exception:
            return False

