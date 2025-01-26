from rest_framework import serializers
from .models import User, FriendshipRequest

class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'rank', 'is_active']


class ReceivedFriendshipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendshipRequest
        fields = ['id', 'sender', 'receiver', 'status', 'is_active', 'created_date']
        read_only_fields = ['id', 'sender', 'receiver', 'is_active', 'created_date']

class SentFriendshipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendshipRequest
        fields = ['id', 'sender', 'receiver', 'status', 'is_active', 'created_date']
        read_only_fields = ['id', 'sender', 'status', 'created_date']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get('request')
        if request and request.method == 'POST':
            self.fields['is_active'].read_only = True
        elif request and request.method in ['PUT', 'PATCH']:
            self.fields['receiver'].read_only = True
