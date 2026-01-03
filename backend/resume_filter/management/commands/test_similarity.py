"""
Management command to test the similarity service.
Usage: python manage.py test_similarity
"""
from django.core.management.base import BaseCommand
from resume_filter.services.similarity_service import SimilarityService


class Command(BaseCommand):
    help = 'Test the similarity service with sample data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Testing Similarity Service...'))
        
        # Initialize service
        try:
            service = SimilarityService()
            self.stdout.write(self.style.SUCCESS('✓ Service initialized'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Failed to initialize service: {str(e)}'))
            return
        
        # Test data
        job_description = "Looking for a Python developer with Django experience, REST API development, and database design skills."
        
        resumes = [
            {
                'name': 'resume1.pdf',
                'text': 'Experienced Python developer with 5 years of Django framework expertise. Strong background in REST API development and PostgreSQL database design.'
            },
            {
                'name': 'resume2.pdf',
                'text': 'Marketing specialist with social media management and content creation experience. Proficient in Adobe Creative Suite.'
            },
            {
                'name': 'resume3.pdf',
                'text': 'Senior software engineer specializing in Python, Django, and FastAPI. Expert in database optimization and microservices architecture.'
            },
        ]
        
        # Test similarity calculation
        self.stdout.write('\nCalculating similarities...')
        for resume in resumes:
            try:
                similarity = service.calculate_similarity(resume['text'], job_description)
                score_percent = similarity * 100
                self.stdout.write(
                    f"  {resume['name']}: {score_percent:.2f}% similarity"
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"  ✗ Error processing {resume['name']}: {str(e)}")
                )
        
        # Test ranking
        self.stdout.write('\nRanking resumes (threshold: 20%)...')
        try:
            ranked = service.rank_resumes(resumes, job_description, threshold=0.20)
            self.stdout.write(f"  Found {len(ranked)} resumes above threshold:")
            for resume in ranked:
                self.stdout.write(
                    f"    - {resume['name']}: {resume['similarity_score']:.2f}%"
                )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"  ✗ Error ranking resumes: {str(e)}"))
        
        self.stdout.write(self.style.SUCCESS('\n✓ Test completed!'))

