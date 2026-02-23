import api.models as models
from rest_framework import viewsets
import api.serializers as serializers
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate, login, logout
import json
from rest_framework import status
from django.http.response import JsonResponse, HttpResponse


def not_found(request):
    raise Http404


def do_login(request):
    body = json.loads(request.body)
    username = body['username']
    password = body['password']

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse()

    return JsonResponse(
        {"error": "Invalid credentials"},
        status=status.HTTP_400_BAD_REQUEST)


def do_logout(request):
    logout(request)
    return HttpResponse(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        serializer = self.get_serializer(user)

        return Response(serializer.data)


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


class VenueViewSet(viewsets.ModelViewSet):
    queryset = models.Venue.objects.all()
    serializer_class = serializers.VenueSerializer
