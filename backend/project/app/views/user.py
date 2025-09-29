from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from app.models import User
from app.serializers import UserSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()
