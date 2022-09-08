from django.db import models
from django.core.validators import MinValueValidator
from django_eventstream import send_event
from api.constants import SSE_CHANNEL_DESCENTS, SSE_TYPE_MESSAGE
from api.utils import ModelDiffMixin


class Pilot(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        db_table = "pilot"


class Venue(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "venue"


class Track(models.Model):
    name = models.CharField(max_length=100)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.venue})"

    class Meta:
        db_table = "track"


class Championship(models.Model):
    '''Long term championship'''
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "championship"


class Race(models.Model):
    '''Race day that belongs to a championship'''
    name = models.CharField(max_length=100)
    date = models.DateField()
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    championship = models.ForeignKey(Championship, on_delete=models.CASCADE)
    pilots = models.ManyToManyField(Pilot, through='RacePilot')

    def __str__(self):
        return f"{self.name} - {self.championship} - ({self.venue})"

    class Meta:
        db_table = "race"


class RacePilot(models.Model):
    pilot = models.ForeignKey(Pilot, on_delete=models.CASCADE)
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    number = models.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        db_table = "race_pilot"


class Descent(models.Model, ModelDiffMixin):
    race_pilot = models.ForeignKey(
        RacePilot, related_name="descents", on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    start = models.DateTimeField(null=True)
    end = models.DateTimeField(null=True)

    def send_event(self, data):
        data["id"] = self.id
        send_event(SSE_CHANNEL_DESCENTS, SSE_TYPE_MESSAGE, data)

    def save(self, *args, **kwargs):
        start_diff = self.get_field_diff("start")
        end_diff = self.get_field_diff("end")

        if start_diff is not None:
            self.send_event(
                {'start': None
                 if start_diff[1] is None else start_diff[1].strftime(
                     '%Y-%m-%dT%H:%M:%S.%f')[: -4] + "Z"})

        if end_diff is not None:
            self.send_event(
                {'end': None
                 if end_diff[1] is None else end_diff[1].strftime(
                     '%Y-%m-%dT%H:%M:%S.%f')[: -4] + "Z"})

        return super().save(*args, **kwargs)

    @property
    def duration(self):
        if not self.start:
            return -1

        if not self.end:
            return 0

        return (self.end - self.start).total_seconds() * 100

    class Meta:
        db_table = "descent"
        unique_together = ('race_pilot', 'track')
