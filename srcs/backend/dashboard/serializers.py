from rest_framework import serializers
from game.models import GameDB, TMPGameDB, GameEvent

class GameDBSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameDB
        fields = '__all__'

class TMPGameDBSerializer(serializers.ModelSerializer):
    class Meta:
        model = TMPGameDB
        fields = '__all__'

class GameEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameEvent
        fields = '__all__'