"""
URL configuration for resume_filter app.
"""
from django.urls import path
from .views import FilterResumesView

app_name = 'resume_filter'

urlpatterns = [
    path('filter-resumes', FilterResumesView.as_view(), name='filter-resumes'),
]


