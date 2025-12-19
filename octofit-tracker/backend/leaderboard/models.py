from django.db import models
from django.conf import settings

# Create your models here.

class LeaderboardEntry(models.Model):
    """
    Model to track leaderboard rankings
    This is a snapshot model that gets updated periodically
    """
    LEADERBOARD_TYPE_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('all_time', 'All Time'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leaderboard_entries')
    leaderboard_type = models.CharField(max_length=20, choices=LEADERBOARD_TYPE_CHOICES)
    rank = models.IntegerField()
    points = models.IntegerField(default=0)
    period_start = models.DateField()
    period_end = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leaderboard_entries'
        ordering = ['leaderboard_type', 'rank']
        unique_together = ['user', 'leaderboard_type', 'period_start']
    
    def __str__(self):
        return f"{self.user.username} - Rank {self.rank} ({self.leaderboard_type})"
