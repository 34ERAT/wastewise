from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from app.models import WasteRequest
from app.serializers import WasteRequestSerializer


class WasteRequestRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """retrieve update operation for waste request"""

    serializer_class = WasteRequestSerializer
    queryset = WasteRequest.objects.all()
    permission_classes = [IsAuthenticated]


class WasteRequestListCreateAPIView(generics.ListCreateAPIView):
    """
    list all waste request that belong to the user
    or
    create and new waste request
    """

    queryset = WasteRequest.objects.all()
    serializer_class = WasteRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().fillter(user=self.request.user)
