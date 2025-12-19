from django.db import models
from django.conf import settings

# Create your models here.

class Activity(models.Model):
    """
    Model to track fitness activities
    """
    ACTIVITY_TYPE_CHOICES = [
        ('running', 'Running'),
        ('walking', 'Walking'),
        ('cycling', 'Cycling'),
        ('swimming', 'Swimming'),
        ('strength', 'Strength Training'),
        ('yoga', 'Yoga'),
        ('sports', 'Sports'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES)
    duration = models.IntegerField(help_text="Duration in minutes")
    distance = models.FloatField(null=True, blank=True, help_text="Distance in kilometers")
    calories_burned = models.IntegerField(default=0)
    points_earned = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activities'
        ordering = ['-date', '-created_at']
        verbose_name_plural = 'Activities'
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} on {self.date}"
    
    def save(self, *args, **kwargs):
        # Calculate points based on activity type and duration
        points_per_minute = {
            'running': 2,
            'walking': 1,
            'cycling': 1.5,
            'swimming': 2.5,
            'strength': 2,
            'yoga': 1,
            'sports': 2,
            'other': 1,
        }
        self.points_earned = int(self.duration * points_per_minute.get(self.activity_type, 1))
        super().save(*args, **kwargs)


class WorkoutSuggestion(models.Model):
    """
    Model for personalized workout suggestions
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='workout_suggestions')
    title = models.CharField(max_length=200)
    description = models.TextField()
    activity_type = models.CharField(max_length=20, choices=Activity.ACTIVITY_TYPE_CHOICES)
    difficulty = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    duration = models.IntegerField(help_text="Suggested duration in minutes")
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'workout_suggestions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} for {self.user.username}"
