from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Activity, WorkoutSuggestion
from .serializers import ActivitySerializer, WorkoutSuggestionSerializer
from users.models import User


class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Activity model
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    
    def perform_create(self, serializer):
        activity = serializer.save()
        # Update user's total points
        user = activity.user
        total_points = Activity.objects.filter(user=user).aggregate(
            Sum('points_earned')
        )['points_earned__sum'] or 0
        user.total_points = total_points
        user.save()
    
    @action(detail=False, methods=['get'])
    def user_activities(self, request):
        """
        Get activities for a specific user
        """
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        activities = Activity.objects.filter(user_id=user_id)
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get activity statistics for a user
        """
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        activities = Activity.objects.filter(user_id=user_id)
        total_activities = activities.count()
        total_duration = activities.aggregate(Sum('duration'))['duration__sum'] or 0
        total_distance = activities.aggregate(Sum('distance'))['distance__sum'] or 0
        total_calories = activities.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0
        total_points = activities.aggregate(Sum('points_earned'))['points_earned__sum'] or 0
        
        return Response({
            'total_activities': total_activities,
            'total_duration': total_duration,
            'total_distance': total_distance,
            'total_calories': total_calories,
            'total_points': total_points
        })


class WorkoutSuggestionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for WorkoutSuggestion model
    """
    queryset = WorkoutSuggestion.objects.all()
    serializer_class = WorkoutSuggestionSerializer
    
    @action(detail=False, methods=['get'])
    def user_suggestions(self, request):
        """
        Get workout suggestions for a specific user
        """
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        suggestions = WorkoutSuggestion.objects.filter(user_id=user_id, is_completed=False)
        serializer = self.get_serializer(suggestions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Mark a workout suggestion as completed
        """
        suggestion = self.get_object()
        suggestion.is_completed = True
        suggestion.save()
        return Response(self.get_serializer(suggestion).data)
