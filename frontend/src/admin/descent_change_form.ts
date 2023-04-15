import $ from 'jquery';

declare global {
  interface Window {
    django: { jQuery: typeof $ };
  }
}

interface RacePilot {
  id: number;
  first_name: string;
  last_name: string;
  number: number;
}

interface Venue {
  tracks: Track[];
}

interface Track {
  id: number;
  name: string;
}

// Trigger an ajax request to populate the Race Pilot field with the response pilots
window.django
  .jQuery<HTMLSelectElement>('#id_race')
  .on<'change'>('change', function () {
    const race_id = window.django.jQuery(this).val();

    window.django.jQuery('#id_race_pilot').empty();
    window.django.jQuery('#id_track').empty();

    if (!race_id) return;

    window.django.jQuery.ajax({
      url: `/api/races/${race_id}/pilots/`,
      success: function (data: RacePilot[]) {
        window.django
          .jQuery('#id_race_pilot')
          .append(
            window.django
              .jQuery('<option></option>')
              .val('')
              .text('Select pilot')
          );
        window.django.jQuery.each(data, function (_, value) {
          window.django
            .jQuery('#id_race_pilot')
            .append(
              window.django
                .jQuery('<option></option>')
                .val(value.id)
                .text(
                  `${value.first_name} ${value.last_name} (${value.number})`
                )
            );
        });
      },
    });

    window.django.jQuery.ajax({
      url: `/api/races/${race_id}?fields=venue&expand=venue&omit=venue.id,venue.name`,
      success: function (data: { venue: Venue }) {
        window.django
          .jQuery('#id_track')
          .append(
            window.django
              .jQuery('<option></option>')
              .val('')
              .text('Select track')
          );
        window.django.jQuery.each(data.venue.tracks, function (_, track) {
          window.django
            .jQuery('#id_track')
            .append(
              window.django
                .jQuery('<option></option>')
                .val(track.id)
                .text(track.name)
            );
        });
      },
    });
  });
