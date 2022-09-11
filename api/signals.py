from django.db.models.signals import post_save
from django.dispatch import receiver
from django_eventstream import send_event
from api.constants import SSE_CHANNEL_DESCENTS, SSE_TYPE_MESSAGE
from api.models import Descent
from api.serializers import DescentSerializer


@receiver(post_save, sender=Descent)
def send_descent_updated_event(sender, instance, **kwargs):
    data = DescentSerializer(
        instance, expand=["race_pilot", "track"],
        omit=["race_pilot.descents"]).data
    send_event(SSE_CHANNEL_DESCENTS, SSE_TYPE_MESSAGE, data)
