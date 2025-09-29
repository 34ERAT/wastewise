from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from app.views.user import UserProfileView
from app.views.vehicles import (
    VehiclesListCreateAPIView,
    VehiclesRetriveUpdateAPIView,
)
from app.views.waste import (
    WasteRequestListCreateAPIView,
    WasteRequestRetrieveUpdateAPIView,
)
from app.views.auth import LoginView, UserRegistrationView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version="v1",
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    # api docs
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "register/",
        UserRegistrationView.as_view(),
        name="registerUser",
    ),
    path("login/", LoginView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "profile/<str:pk>",
        UserProfileView.as_view(),
        name="profile",
    ),
    # waste_request endpoints
    path(
        "waste-requests/",
        WasteRequestListCreateAPIView.as_view(),
        name="creat/listRequest",
    ),
    path(
        "waste-requests/<str:pk>",
        WasteRequestRetrieveUpdateAPIView.as_view(),
        name="update/get_wasteRequest",
    ),
    # vehicles  endpoints
    path("vehicles/", VehiclesListCreateAPIView.as_view(), name="create/list"),
    path(
        "vehicles/<str:pk>",
        VehiclesRetriveUpdateAPIView.as_view(),
        name="retrive/update",
    ),
    path("ask/", views.chatbot, name="ask_question"),
]
