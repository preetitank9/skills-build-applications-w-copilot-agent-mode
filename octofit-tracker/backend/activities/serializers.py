from rest_framework import serializers
from .models import Activity, WorkoutSuggestion


class ActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for Activity model
    """
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_username', 'activity_type', 'duration', 'distance', 
                  'calories_burned', 'points_earned', 'notes', 'date', 'created_at']
        read_only_fields = ['id', 'points_earned', 'created_at']


class WorkoutSuggestionSerializer(serializers.ModelSerializer):
    """
    Serializer for WorkoutSuggestion model
    """
    class Meta:
        model = WorkoutSuggestion
        fields = ['id', 'user', 'title', 'description', 'activity_type', 'difficulty', 
                  'duration', 'is_completed', 'created_at']
        read_only_fields = ['id', 'created_at']
