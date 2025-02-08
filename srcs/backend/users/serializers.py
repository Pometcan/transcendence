import os
import pyotp
import requests
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import Q
from .models import User, FriendshipRequest
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login
from django.contrib.auth.hashers import check_password
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404



CLIENT_ID = settings.INTRA_CLIENT_ID
REDIRECT_URI = settings.INTRA_REDIRECT_URI
TOKEN_URL = os.getenv('TOKEN_URL')
USER_INFO_URL = os.getenv('USER_INFO_URL')
CLIENT_SECRET = settings.INTRA_CLIENT_SECRET


class UserBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'rank', 'mfa_enabled']
        read_only_fields = ['id','avatar', 'rank']


#AUTH SERIALIZERS-----------------------------------------

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = get_object_or_404(User, username=data['username'])
        if not check_password(data['password'], user.password):
            raise serializers.ValidationError("Invalid credentials")
        return {'user': user}

class OAuthLoginSerializer(serializers.Serializer):
    code = serializers.CharField(write_only=True)
    def validate(self, data):
        request = self.context.get("request")
        code = data.get("code")
        token_data = {
            "grant_type": "authorization_code",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": code,
            "redirect_uri": REDIRECT_URI,
        }
        token_response = requests.post(TOKEN_URL, data=token_data)
        token_json = token_response.json()
        if "access_token" not in token_json:
            raise serializers.ValidationError({"error": "Failed to retrieve access token"})
        
        access_token = token_json["access_token"]
        user_response = requests.get(USER_INFO_URL, headers={"Authorization": f"Bearer {access_token}"})
        user_info = user_response.json()
        user, created = User.objects.update_or_create(
            id=user_info['id'],
            defaults={'username': user_info['login'], 'email': user_info.get('email', '')}
        )
        
        profile_image_url = user_info.get('image', {}).get('link', '')
        if created and profile_image_url:
            response = requests.get(profile_image_url)
            if response.status_code == 200:
                file_name = f"{user.username}_avatar.jpg"
                user.avatar.save(file_name, ContentFile(response.content), save=True)
        
        login(request, user)
        
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
        }

class TwoFAVerifySerializer(serializers.Serializer):
    username = serializers.CharField()
    otp_code = serializers.CharField()

    def validate(self, data):
        user = get_object_or_404(User, username=data['username'])
        totp = pyotp.TOTP(user.mfa_secret)
        if not totp.verify(data['otp_code'],valid_window=5):
            raise serializers.ValidationError("Invalid OTP code")

        return {'user_id': user.id, 'message': "OTP successfully verified"}

#USER MOEL SERIALIZERS------------------------------------------------------------

class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'is_active']
        read_only_fields = ['id', 'avatar']


class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['avatar']
    
    @staticmethod
    def delete_old_avatar(instance, old_avatar):
        old_avatar_path = os.path.abspath(old_avatar.path)
        default_avatar_path = os.path.abspath(os.path.join(settings.MEDIA_ROOT, instance._meta.get_field('avatar').get_default()))

        if old_avatar_path != default_avatar_path and os.path.exists(old_avatar_path):
            os.remove(old_avatar_path)

    def update(self, instance, validated_data):
        new_avatar = validated_data.get('avatar')
        if new_avatar is not None:
            old_avatar = instance.avatar
            instance.avatar = new_avatar
            instance.save()
            if old_avatar:
                self.delete_old_avatar(instance, old_avatar)
        elif 'avatar' in validated_data:
            instance.avatar = instance._meta.get_field('avatar').get_default()
            instance.save()
        return instance
    
    def delete(self, instance):
        old_avatar = instance.avatar
        instance.avatar = instance._meta.get_field('avatar').get_default()
        instance.save()
        if old_avatar:
            self.delete_old_avatar(instance, old_avatar)
        return instance



#FRIENDSHIP REQUEST SERIALIZERS
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

#FRIENDS SERIALIZER      
class FriendsSerializer(serializers.ModelSerializer):
    friend_id = serializers.IntegerField(write_only=True)
    friend = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['friend_id', 'friend']
    
    def get_friend(self, obj):
        return UserBasicInfoSerializer(obj).data
    
    def validate_friend_id(self, value):
        request = self.context.get('request')
        try:
            friend = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Kullanıcı bulunamadı.")
        try:
            User.objects.get_friend_validation(request.user, friend)
        except ValueError as e:
            raise serializers.ValidationError(str(e))
        self.context['friend'] = friend
        return value
    
    def delete(self, validated_data):
        request_user = self.context['request'].user
        friend = self.context['friend']
        request_user.friends.remove(friend)
        return friend
    

#BLOCKED_USER SERIALIZER
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

class SearcUserByUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields= ['username']