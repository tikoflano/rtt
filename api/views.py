import api.models as models
from rest_framework import viewsets, status
from rest_framework.decorators import action
import api.serializers as serializers
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes


class PilotViewSet(viewsets.ModelViewSet):
    queryset = models.Pilot.objects.all()
    serializer_class = serializers.PilotSerializer


class RaceViewSet(viewsets.ModelViewSet):
    queryset = models.Race.objects.all()
    serializer_class = serializers.RaceSerializer
    lookup_field = 'id'


@extend_schema(
    parameters=[
        OpenApiParameter(
            "race_id", OpenApiTypes.INT, OpenApiParameter.PATH)])
class RacePilotViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RacePilotSerializer
    queryset = models.RacePilot.objects.all()

    def get_queryset(self):
        race_id = self.kwargs.get("race_id")
        race = get_object_or_404(models.Race, pk=race_id)
        return self.queryset.filter(
            race=race).prefetch_related(
            Prefetch('descents'))


@extend_schema(
    parameters=[
        OpenApiParameter(
            "race_id", OpenApiTypes.INT, OpenApiParameter.PATH)])
class RaceDescentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DescentSerializer
    queryset = models.Descent.objects.all()

    def get_queryset(self):
        race_id = self.kwargs.get("race_id")
        race = get_object_or_404(models.Race, pk=race_id)
        return self.queryset.filter(race_pilot__race=race)
