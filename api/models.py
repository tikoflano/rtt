from django.db import models
from django.core.validators import MinValueValidator
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


class TrackVariation(models.Model):
    '''A variation of a track, e.g. when a section is bypassed for repairs'''
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='variations')
    description = models.CharField(
        max_length=255,
        blank=True,
        help_text='Description of the variation (e.g. "Bypass area under reparation"). Leave blank for standard route.'
    )

    def __str__(self):
        if self.description:
            return f"{self.track.name} — {self.description}"
        return f"{self.track.name} (standard)"

    def clean(self):
        from django.core.exceptions import ValidationError
        super().clean()
        if not self.description:
            existing = TrackVariation.objects.filter(
                track=self.track, description=''
            ).exclude(pk=self.pk)
            if existing.exists():
                raise ValidationError(
                    {'description': 'Only one variation per track can have an empty description (standard variation).'}
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    class Meta:
        db_table = "track_variation"
        constraints = [
            models.UniqueConstraint(
                fields=['track'],
                condition=models.Q(description=''),
                name='unique_standard_variation_per_track',
            ),
        ]


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
        return f"{self.championship} - {self.name} - ({self.venue})"

    class Meta:
        db_table = "race"


class RacePilot(models.Model):
    pilot = models.ForeignKey(Pilot, on_delete=models.CASCADE)
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    number = models.IntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return f"{self.pilot.first_name} {self.pilot.last_name} ({self.number})"

    class Meta:
        db_table = "race_pilot"
        unique_together = ('race', 'number')


class Descent(models.Model, ModelDiffMixin):
    class DescentStatus(models.TextChoices):
        PENDING = "pending"
        RUNNING = "running"
        PAUSED = "paused"
        FINISHED = "finished"
        DNS = "dns"
        DNF = "dnf"

    race_pilot = models.ForeignKey(
        RacePilot, related_name="descents", on_delete=models.CASCADE)
    track_variation = models.ForeignKey(
        TrackVariation, related_name="descents", on_delete=models.CASCADE
    )
    start = models.DateTimeField(null=True, blank=True)
    end = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=DescentStatus.choices,
        default=DescentStatus.PENDING)

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

    @property
    def duration(self):
        if not self.start:
            return -1

        if not self.end:
            return 0

        return (self.end - self.start).total_seconds() * 100

    def __str__(self):
        return f"{self.race_pilot} - {self.track_variation}"

    class Meta:
        db_table = "descent"
        unique_together = ('race_pilot', 'track_variation')
