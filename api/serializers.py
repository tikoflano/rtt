from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer
import api.models as models
from django.shortcuts import get_object_or_404


class PilotSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = models.Pilot
        fields = ['id', 'first_name', 'last_name']


class VenueSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = models.Venue
        fields = ['id', 'name']


class TrackSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = models.Track
        fields = ['id', 'name', 'venue']
        expandable_fields = {
            'venue': VenueSerializer
        }


class DescentSerializer(FlexFieldsModelSerializer):
    duration = serializers.IntegerField(read_only=True)

    def validate(self, data):
        race_id = self.context["request"].parser_context['kwargs']['race_id']
        race = get_object_or_404(models.Race, pk=race_id)
        data["race"] = race

        return data

    class Meta:
        model = models.Descent
        fields = ['id', 'race_pilot', 'track', 'start', 'end', 'duration']
        expandable_fields = {
            'race_pilot': ('api.RacePilotSerializer', {'many': False}),
            'track': TrackSerializer
        }


class RaceSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = models.Race
        fields = ['id', 'name', 'date', 'venue']
        expandable_fields = {
            'venue': VenueSerializer
        }


class RacePilotSerializer(FlexFieldsModelSerializer):
    id = serializers.IntegerField(source='pilot.id')
    first_name = serializers.CharField(source='pilot.first_name')
    last_name = serializers.CharField(source='pilot.last_name')

    class Meta():
        model = models.RacePilot
        fields = ['id', 'first_name', 'last_name', 'descents', 'number']
        expandable_fields = {'descents': (DescentSerializer, {'many': True})}
