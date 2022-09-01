from django.contrib import admin
import api.models as models
from django.conf.locale.en import formats as en_formats

en_formats.DATETIME_FORMAT = "d M Y H:i:s"


class PilotAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name')


class VenueAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


class ChampionshipAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


class TrackAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'venue')
    list_filter = ('venue',)


class RaceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'championship', 'venue', 'date')
    list_filter = ('championship', 'venue')
    date_hierarchy = 'date'


class DescentAdmin(admin.ModelAdmin):
    list_display = ('id', 'race_pilot', 'track', 'start')


admin.site.register(models.Pilot, PilotAdmin)
admin.site.register(models.Venue, VenueAdmin)
admin.site.register(models.Championship, ChampionshipAdmin)
admin.site.register(models.Track, TrackAdmin)
admin.site.register(models.Race, RaceAdmin)
admin.site.register(models.Descent, DescentAdmin)
