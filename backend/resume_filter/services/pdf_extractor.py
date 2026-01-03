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
        """Extract text using pdfplumber library with improved extraction."""
        pdf_file.seek(0)  # Reset file pointer
        text_parts = []
        
        try:
            with pdfplumber.open(BytesIO(pdf_file.read())) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    # Try multiple extraction strategies
                    page_text = None
                    
                    # Strategy 1: Direct text extraction
                    page_text = page.extract_text()
                    
                    # Strategy 2: If direct extraction fails or is poor, try table extraction
                    if not page_text or len(page_text.strip()) < 50:
                        # Try extracting from tables
                        tables = page.extract_tables()
                        if tables:
                            table_texts = []
                            for table in tables:
                                for row in table:
                                    if row:
                                        row_text = ' '.join([str(cell) if cell else '' for cell in row])
                                        if row_text.strip():
                                            table_texts.append(row_text)
                            if table_texts:
                                page_text = ' '.join(table_texts)
                                logger.debug(f"Extracted text from tables on page {page_num}")
                    
                    # Strategy 3: Extract words and reconstruct
                    if not page_text or len(page_text.strip()) < 50:
                        words = page.extract_words()
                        if words:
                            # Sort words by position (top to bottom, left to right)
                            words_sorted = sorted(words, key=lambda w: (w.get('top', 0), w.get('x0', 0)))
                            page_text = ' '.join([w.get('text', '') for w in words_sorted if w.get('text')])
                            logger.debug(f"Reconstructed text from words on page {page_num}")
                    
                    if page_text and page_text.strip():
                        text_parts.append(page_text.strip())
                        logger.debug(f"Extracted {len(page_text)} characters from page {page_num}")
                    
        except Exception as e:
            logger.warning(f"pdfplumber extraction failed: {str(e)}")
            return ""
        
        full_text = "\n".join(text_parts)
        logger.debug(f"Total extracted text length: {len(full_text)} characters from {len(text_parts)} pages")
        return full_text
    
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

