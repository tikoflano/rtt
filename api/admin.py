from django.contrib import admin
import api.models as models
from django.conf.locale.en import formats as en_formats
from django import forms

en_formats.DATETIME_FORMAT = "d M Y H:i:s"


@admin.register(models.Pilot)
class PilotAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name')


@admin.register(models.Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(models.Championship)
class ChampionshipAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


@admin.register(models.Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'venue')
    list_filter = ('venue',)


@admin.register(models.Race)
class RaceAdmin(admin.ModelAdmin):
    fields = ('championship', 'name', 'venue', 'date')
    list_display = ('id', 'name', 'championship', 'venue', 'date')
    list_filter = ('championship', 'venue')
    date_hierarchy = 'date'


class DescentAdminForm(forms.ModelForm):
    race = forms.ModelChoiceField(models.Race.objects.all())


@admin.register(models.Descent)
class DescentAdmin(admin.ModelAdmin):
    form = DescentAdminForm
    fields = ('race', 'race_pilot', 'track', 'start', 'end', 'status')
    list_display = ('id', 'race', 'pilot', 'track', 'start')

    def race(self, obj):
        return obj.race_pilot.race

    def pilot(self, obj):
        return obj.race_pilot

    def get_form(self, request, obj=None, *args, **kwargs):
        form = super(DescentAdmin, self).get_form(request, *args, **kwargs)
        if request.resolver_match.kwargs:
            obj = models.Descent.objects.get(
                id=request.resolver_match.kwargs["object_id"])
            form.base_fields['race'].initial = obj.race_pilot.race.id
        else:
            form.base_fields['race'].initial = None

        return form

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if request.resolver_match.kwargs:
            obj = models.Descent.objects.get(
                id=request.resolver_match.kwargs["object_id"])

            if db_field.name == "race_pilot":
                kwargs["queryset"] = models.RacePilot.objects.filter(
                    pilot=obj.race_pilot.pilot)
            elif db_field.name == "track":
                kwargs["queryset"] = models.Track.objects.filter(
                    id=obj.track.id)

        else:
            if db_field.name == "race_pilot":
                kwargs["queryset"] = models.RacePilot.objects.none()
            elif db_field.name == "track":
                kwargs["queryset"] = models.Track.objects.none()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@ admin.register(models.RacePilot)
class RacePilotAdmin(admin.ModelAdmin):
    list_display = ("id", "race", "number", "pilot")
    list_filter = ('race',)
