from django.db.models.signals import post_save
from django.dispatch import receiver
from django_eventstream import send_event
from api.constants import SSE_CHANNEL_DESCENTS, SSE_TYPE_MESSAGE
from api.models import Descent, Track, TrackVariation
from api.serializers import DescentSerializer


@receiver(post_save, sender=Track)
def create_standard_track_variation(sender, instance, created, **kwargs):
    """Create a standard (no variation) TrackVariation when a new Track is created."""
    if created:
        TrackVariation.objects.get_or_create(track=instance, description='')


@receiver(post_save, sender=Descent)
def send_descent_updated_event(sender, instance, **kwargs):
    data = DescentSerializer(
        instance, expand=["race_pilot", "track_variation"],
        omit=["race_pilot.descents"]).data
    send_event(SSE_CHANNEL_DESCENTS, SSE_TYPE_MESSAGE, data)
