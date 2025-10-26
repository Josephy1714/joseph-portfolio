from django.db import models

# Create your models here.
from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=100)  # Your name
    role = models.CharField(max_length=100)  # Your professional title
    location = models.CharField(max_length=100)  # Your city/country
    tagline = models.TextField()  # A short cinematic tagline

    def __str__(self):
        return self.name  # Controls how this appears in the admin list

class Project(models.Model):
    title = models.CharField(max_length=200)  # Project title
    description = models.TextField()  # What the project is about
    video_link = models.URLField(blank=True)  # Optional link to YouTube or TikTok
    image = models.ImageField(upload_to='projects/', blank=True)  # Optional thumbnail
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp

    def __str__(self):
        return self.title
