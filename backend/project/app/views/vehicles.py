from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from app.models import Vehicle
from app.serializers import VehicleSerializer


class VehiclesListCreateAPIView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class VehiclesRetriveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
