from django.db.models import Q
from rest_framework import serializers
from .models import User, FriendshipRequest
from django.core.exceptions import ValidationError

class UserBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'rank']
        read_only_fields = ['id','avatar', 'rank']


class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'is_active']


class ReceivedFriendshipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendshipRequest
        fields = ['id', 'sender', 'receiver', 'status', 'is_active', 'created_date']
        read_only_fields = ['id', 'sender', 'receiver', 'is_active', 'created_date']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sender'] = UserBasicInfoSerializer(instance.sender).data
        return representation

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


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['receiver'] = UserBasicInfoSerializer(instance.receiver).data
        return representation

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get('request')
        if request and request.method == 'POST':
            self.fields['is_active'].read_only = True
        elif request and request.method in ['PUT', 'PATCH']:
            self.fields['receiver'].read_only = True
           
    def validate(self, data):
        request = self.context.get('request')
        instance = self.instance
        if instance and request.method in ['PUT', 'PATCH', 'GET']:
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



class BlockUserSerializer(serializers.ModelSerializer):
    blocked_user_id = serializers.IntegerField(write_only=True)
    blocked_user = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['blocked_user_id', 'blocked_user']

    def get_blocked_user(self, obj):
        return UserBasicInfoSerializer(obj).data

    def validate_blocked_user_id(self, value):
        request = self.context.get('request')
        try:
            blocked_user = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Kullanıcı bulunamadı.")
        if request.method in ['DELETE', 'LIST', 'GET']: # GET, LIST ve DELETE için validasyon
            try:
                User.objects.get_blocked_user_valdation(request.user, blocked_user)
            except ValueError as e:
                raise serializers.ValidationError(str(e))
        elif request.method == 'POST': # POST için validasyon
            try:
                User.objects.block_user_validation(request.user, blocked_user)
            except ValueError as e:
                raise serializers.ValidationError(str(e))
        self.context['blocked_user'] = blocked_user
        return value

    def create(self, validated_data):
        request_user = self.context['request'].user
        blocked_user = self.context['blocked_user']
        request_user.blocked_users.add(blocked_user)
        
        request_user.friends.remove(blocked_user) # Blocklanan kullanıcı arkadaş listesinden çıkarılır.
        blocked_user.friends.remove(request_user) # Blocklanan kullanıcının arkadaş listesinden çıkılır.
        
        FriendshipRequest.objects.filter((Q(sender=request_user, receiver=blocked_user) \
                                        | Q(sender=blocked_user, receiver=request_user)), \
                                        is_active=True).update(is_active=False) #Arkadaşlık istekleri pasife alınır.
        return blocked_user

    def delete(self, validated_data):
        request_user = self.context['request'].user
        blocked_user = self.context['blocked_user']
        request_user.blocked_users.remove(blocked_user)
        return blocked_user
        
