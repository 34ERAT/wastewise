from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response, status
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers import (
    LoginSerializer,
    UserSerializer,
)
from ..models import User
from rest_framework import generics


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        response = Response(
            {"user": data["user"], "accessToken": data["accessToken"]},
            status=status.HTTP_200_OK,
        )
        response.set_cookie(
            key="refreshToken",
            value=data["refreshToken"],
            httponly=True,
            secure=True,
            samesite="Strict",
        )
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refreshToken")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie("refreshToken")
        return response


class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refreshToken")

        if not refresh_token:
            raise AuthenticationFailed("Refresh token missing")

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
        except Exception:
            raise AuthenticationFailed("Invalid or expired refresh token")

        return Response({"access": access_token}, status=status.HTTP_200_OK)
