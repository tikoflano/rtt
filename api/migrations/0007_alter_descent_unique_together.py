# Generated by Django 4.0.6 on 2022-08-29 04:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_descent_end_alter_descent_start'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='descent',
            unique_together={('race', 'track', 'pilot')},
        ),
    ]