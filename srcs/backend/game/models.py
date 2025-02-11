from django.db import models

class GameDB(models.Model):
    room_id = models.CharField(max_length=1000)
    player1_id = models.CharField(max_length=1000)
    player1_score = models.IntegerField(default=0)
    player2_id = models.CharField(max_length=1000)
    player2_score = models.IntegerField(default=0)
    winner_id = models.CharField(max_length=1000)
    create_date = models.CharField(max_length=1000) # Bunu DateTimeField'a çevirelim mi? (serkan)
    end_date = models.CharField(max_length=1000)   # Bunu DateTimeField'a çevirelim mi? (serkan)

    game_type = models.CharField(max_length=50, default='default', blank=True)
    game_mode = models.CharField(max_length=50, default='single', blank=True)
    player1_rank_before_game = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    player2_rank_before_game = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    player1_rank_after_game = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    player2_rank_after_game = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"GameDB - Room ID: {self.room_id}"


class TMPGameDB(models.Model):
    room_id = models.CharField(max_length=1000)
    player1_id = models.CharField(max_length=1000)
    player1_score = models.IntegerField(default=0)
    player2_id = models.CharField(max_length=1000)
    player2_score = models.IntegerField(default=0)
    winner_id = models.CharField(max_length=1000)
    create_date = models.CharField(max_length=1000) # Bunu DateTimeField'a çevirelim mi? (serkan)
    end_date = models.CharField(max_length=1000)   # Bunu DateTimeField'a çevirelim mi? (serkan)

    game_type = models.CharField(max_length=50, default='default', blank=True)
    game_mode = models.CharField(max_length=50, default='single', blank=True)
    player1_rank_before_game = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    player2_rank_before_game = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    player1_rank_after_game = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    player2_rank_after_game = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"TMPGameDB - Room ID: {self.room_id}"


class GameEvent(models.Model):
    game_db = models.ForeignKey(GameDB, related_name='events', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    event_type = models.CharField(max_length=50)
    player_id = models.CharField(max_length=1000, blank=True, null=True)
    event_details = models.JSONField(null=True, blank=True) 

    def __str__(self):
        return f"Game Event in Game {self.game_db.room_id} - {self.event_type} at {self.timestamp}"