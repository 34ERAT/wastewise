from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from app.models import (
    Collection,
    RecyclingCenter,
    User,
    Vehicle,
    WasteRequest,
    WasteType,
)

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    """create user  user"""

    class Meta:
        model = User
        fields = ["id", "email", "phone", "user_type", "password"]
        read_only_fields = ["id"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        print(validated_data)
        user = User(**validated_data)
        user.set_password(password)  # hash password
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        print({"email": data.get("email"), "password": data.get("password")})
        user = authenticate(
            request=self.context.get("request"),
            email=data.get("email"),
            password=data.get("password"),
        )

        if user is None:
            raise AuthenticationFailed("Invalid email or password")
        if not user.is_active:
            raise AuthenticationFailed("User account is disabled")

        update_last_login(None, user)
        refresh = RefreshToken.for_user(user)

        return {
            "user": UserSerializer(user).data,
            "accessToken": str(refresh.access_token),
            "refreshToken": str(refresh),
        }


class WasteTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteType
        fields = ["id", "name", "description"]


class WasteRequestSerializer(serializers.ModelSerializer):
    waste_type = serializers.StringRelatedField(read_only=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = WasteRequest
        fields = [
            "user",
            "waste_type",
            "volume_kg",
            "status",
            "schedule_time",
            "location",
        ]


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = "__all__"


class RecyclingCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecyclingCenter
        fields = "__all__"


class CollectionSerializer(serializers.ModelSerializer):
    delivered_to = RecyclingCenterSerializer()

    class Meta:
        model = Collection
        fields = "__all__"
