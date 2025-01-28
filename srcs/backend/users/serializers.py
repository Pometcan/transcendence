from rest_framework import serializers
from .models import User, FriendshipRequest
from django.core.exceptions import ValidationError

class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'rank', 'is_active']


class ReceivedFriendshipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendshipRequest
        fields = ['id', 'sender', 'receiver', 'status', 'is_active', 'created_date']
        read_only_fields = ['id', 'sender', 'receiver', 'is_active', 'created_date']

    def validate(self, data):
        request = self.context.get('request')
        instance = self.instance
        if instance:
            try:
                FriendshipRequest.objects.get_received_friendship_request_validation(instance, request.user)
            except ValidationError as e:
                raise serializers.ValidationError({"detail": str(e)})
        return data


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

    def validate(self, data):
        request = self.context.get('request')
        if request.method in ['PUT', 'PATCH', 'GET']:
            instance = self.instance
            if instance:
                try:
                    FriendshipRequest.objects.get_sent_friendship_request_validation(instance, request.user)
                except ValidationError as e:
                    raise serializers.ValidationError({"detail": str(e)})
        return data

    def create(self, validated_data):
        sender = self.context['request'].user
        receiver = validated_data.get('receiver')
        try:
            FriendshipRequest.objects.create_friendship_request_validation(sender, receiver, 'P')
        except ValidationError as e:
            raise serializers.ValidationError({"detail": str(e)})
        return FriendshipRequest.objects.create(sender=sender, receiver=receiver)


        

