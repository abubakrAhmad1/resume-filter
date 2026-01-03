from django.apps import AppConfig


class ResumeFilterConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'resume_filter'
    
    def ready(self):
        """Initialize app when Django starts."""
        pass



