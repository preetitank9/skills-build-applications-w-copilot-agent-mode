from rest_framework import serializers
from .models import LeaderboardEntry


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for LeaderboardEntry model
    """
    username = serializers.CharField(source='user.username', read_only=True)
    user_type = serializers.CharField(source='user.user_type', read_only=True)
    
    class Meta:
        model = LeaderboardEntry
        fields = ['id', 'user', 'username', 'user_type', 'leaderboard_type', 'rank', 
                  'points', 'period_start', 'period_end', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
