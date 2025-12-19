from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Team
from .serializers import TeamSerializer


class TeamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Team model
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """
        Add a member to a team
        """
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from users.models import User
            user = User.objects.get(id=user_id)
            team.members.add(user)
            team.update_total_points()
            return Response(self.get_serializer(team).data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """
        Remove a member from a team
        """
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from users.models import User
            user = User.objects.get(id=user_id)
            team.members.remove(user)
            team.update_total_points()
            return Response(self.get_serializer(team).data)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def update_points(self, request, pk=None):
        """
        Update team's total points
        """
        team = self.get_object()
        team.update_total_points()
        return Response(self.get_serializer(team).data)
    
    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """
        Get team leaderboard (teams ranked by points)
        """
        teams = Team.objects.all().order_by('-total_points')
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)
