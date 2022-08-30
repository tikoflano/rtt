import api.models as models
from rest_framework import viewsets
import api.serializers as serializers
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


@extend_schema(
    parameters=[
        OpenApiParameter(
            "race_pk", OpenApiTypes.INT, OpenApiParameter.PATH)])
class RacePilotViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.RacePilotSerializer
    queryset = models.Pilot.objects.all()

    def get_queryset(self):
        race_id = self.kwargs.get("race_pk")
        race = get_object_or_404(models.Race, pk=race_id)
        return self.queryset.filter(
            race=race).prefetch_related(
            Prefetch('descents'))


class RaceDescentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DescentSerializer
    queryset = models.Descent.objects.all()

    def get_queryset(self):
        race_id = self.kwargs.get("race_pk")
        race = get_object_or_404(models.Race, pk=race_id)
        return self.queryset.filter(race=race)
