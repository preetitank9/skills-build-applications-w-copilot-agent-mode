from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_serializer_class(self):
        if self.action == 'register':
            return UserRegistrationSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Register a new user
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def students(self, request):
        """
        Get all students
        """
        students = User.objects.filter(user_type='student')
        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def teachers(self, request):
        """
        Get all teachers
        """
        teachers = User.objects.filter(user_type='teacher')
        serializer = self.get_serializer(teachers, many=True)
        return Response(serializer.data)
