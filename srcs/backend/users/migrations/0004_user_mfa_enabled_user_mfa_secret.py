# Generated by Django 5.1.4 on 2025-02-05 22:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_user_managers_alter_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='mfa_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='mfa_secret',
            field=models.CharField(blank=True, max_length=16, null=True),
        ),
    ]
