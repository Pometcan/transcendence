from django.db import models

# Create your models here.

class GameDB(models.Model):
    room_id = models.CharField(max_length=1000)
    player1_id = models.CharField(max_length=1000)
    player1_score = models.IntegerField(default=0)
    player2_id = models.CharField(max_length=1000)
    player2_score = models.IntegerField(default=0)
    winner_id = models.CharField(max_length=1000)
    create_date = models.CharField(max_length=1000)
    end_date = models.CharField(max_length=1000)


class TMPGameDB(models.Model):
    room_id = models.CharField(max_length=1000)
    player1_id = models.CharField(max_length=1000)
    player1_score = models.IntegerField(default=0)
    player2_id = models.CharField(max_length=1000)
    player2_score = models.IntegerField(default=0)
    winner_id = models.CharField(max_length=1000)
    create_date = models.CharField(max_length=1000)
    end_date = models.CharField(max_length=1000)
