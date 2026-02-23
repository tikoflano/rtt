from rest_framework import serializers
from rest_flex_fields import FlexFieldsModelSerializer
import api.models as models
from api.utils import millisecondsDate
from django.contrib.auth.models import User


class UserSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


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
            'venue': VenueSerializer,
            'variations': ('api.TrackVariationSerializer', {'many': True})
        }


class TrackVariationSerializer(FlexFieldsModelSerializer):
    display_name = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        if obj.description:
            return f"{obj.track.name} — {obj.description}"
        return f"{obj.track.name} (standard)"

    class Meta:
        model = models.TrackVariation
        fields = ['id', 'track', 'description', 'display_name']
        expandable_fields = {
            'track': TrackSerializer
        }


class DescentSerializer(FlexFieldsModelSerializer):
    duration = serializers.IntegerField(read_only=True)

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        if instance.start is not None:
            repr["start"] = instance.start.strftime(
                '%Y-%m-%dT%H:%M:%S.%f')[: -4] + "Z"
        if instance.end is not None:
            repr["end"] = instance.end.strftime(
                '%Y-%m-%dT%H:%M:%S.%f')[: -4] + "Z"
        return repr

    def validate(self, data):
        start = data.get(
            "start") or self.instance.start if self.instance else None
        end = data.get("end")

        if end is not None and end and not start:
            raise serializers.ValidationError("descent not started yet")

        if start is not None and end is not None and start > end:
            raise serializers.ValidationError("end must occur after start")

        return data

    def validate_start(self, value):
        return None if value is None else millisecondsDate(value)

    def validate_end(self, value):
        return None if value is None else millisecondsDate(value)

    class Meta:
        model = models.Descent
        fields = ['id', 'race_pilot', 'track_variation',
                  'start', 'end', 'status', 'duration']
        expandable_fields = {
            'race_pilot': ('api.RacePilotSerializer', {'many': False}),
            'track_variation': TrackVariationSerializer
        }


class VenueSerializer(FlexFieldsModelSerializer):
    tracks = TrackSerializer(read_only=True, many=True,
                             source='track_set', omit=['venue'])
    track_variations = serializers.SerializerMethodField()

    def get_track_variations(self, venue):
        variations = models.TrackVariation.objects.filter(track__venue=venue)
        return TrackVariationSerializer(variations, many=True).data

    class Meta:
        model = models.Venue
        fields = ['id', 'name', 'tracks', 'track_variations']


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


class DescentEventSerializer(serializers.Serializer):
    date = serializers.DateTimeField()
