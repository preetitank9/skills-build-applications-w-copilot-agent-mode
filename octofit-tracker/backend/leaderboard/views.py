from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from datetime import date, timedelta
from .models import LeaderboardEntry
from .serializers import LeaderboardEntrySerializer
from users.models import User
from activities.models import Activity


class LeaderboardViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Leaderboard
    """
    queryset = LeaderboardEntry.objects.all()
    serializer_class = LeaderboardEntrySerializer
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """
        Get current leaderboard based on type
        """
        leaderboard_type = request.query_params.get('type', 'all_time')
        
        today = date.today()
        
        if leaderboard_type == 'daily':
            start_date = today
            end_date = today
        elif leaderboard_type == 'weekly':
            start_date = today - timedelta(days=today.weekday())
            end_date = start_date + timedelta(days=6)
        elif leaderboard_type == 'monthly':
            start_date = today.replace(day=1)
            next_month = today.replace(day=28) + timedelta(days=4)
            end_date = next_month - timedelta(days=next_month.day)
        else:  # all_time
            start_date = date(2000, 1, 1)
            end_date = today
        
        # Calculate points for all users in the date range
        users = User.objects.filter(user_type='student')
        leaderboard_data = []
        
        for user in users:
            points = Activity.objects.filter(
                user=user,
                date__gte=start_date,
                date__lte=end_date
            ).aggregate(Sum('points_earned'))['points_earned__sum'] or 0
            
            if points > 0 or leaderboard_type == 'all_time':
                leaderboard_data.append({
                    'user': user.id,
                    'username': user.username,
                    'user_type': user.user_type,
                    'points': points,
                    'leaderboard_type': leaderboard_type
                })
        
        # Sort by points descending
        leaderboard_data.sort(key=lambda x: x['points'], reverse=True)
        
        # Add rank
        for i, entry in enumerate(leaderboard_data, 1):
            entry['rank'] = i
        
        return Response(leaderboard_data)
