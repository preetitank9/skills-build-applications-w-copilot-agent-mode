from rest_framework import serializers
from .models import Team


class TeamSerializer(serializers.ModelSerializer):
    """
    Serializer for Team model
    """
    captain_username = serializers.CharField(source='captain.username', read_only=True)
    member_count = serializers.SerializerMethodField()
    member_usernames = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'captain', 'captain_username', 
                  'members', 'member_usernames', 'member_count', 'total_points', 
                  'goal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'total_points', 'created_at', 'updated_at']
    
    def get_member_count(self, obj):
        return obj.members.count()
    
    def get_member_usernames(self, obj):
        return [member.username for member in obj.members.all()]
