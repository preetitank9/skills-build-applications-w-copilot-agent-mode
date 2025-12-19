from django.db import models
from django.conf import settings

# Create your models here.

class Team(models.Model):
    """
    Model for team creation and management
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    captain = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='captained_teams')
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='teams', blank=True)
    total_points = models.IntegerField(default=0)
    goal = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'teams'
        ordering = ['-total_points', 'name']
    
    def __str__(self):
        return self.name
    
    def update_total_points(self):
        """Calculate total points from all team members"""
        from activities.models import Activity
        total = 0
        for member in self.members.all():
            member_points = Activity.objects.filter(user=member).aggregate(
                models.Sum('points_earned')
            )['points_earned__sum'] or 0
            total += member_points
        self.total_points = total
        self.save()
        return total
