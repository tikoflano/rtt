# Generated by Django 4.0.6 on 2022-08-29 03:49

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_race_pilots'),
    ]

    operations = [
        migrations.AddField(
            model_name='descent',
            name='end',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
