from rest_framework import serializers
from .models import User
from .validators import validate_username, validate_email, validate_password #, validate_avatar
from django.contrib.auth.hashers import make_password

class AddUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'avatar']

    # Username doğrulaması
    def validate_username(self, value):
        return validate_username(value)

    # Email doğrulaması
    def validate_email(self, value):
        return validate_email(value)

    # Password doğrulaması
    def validate_password(self, value):
        return validate_password(value)

    # Avatar link doğrulaması
    # def validate_avatar(self, value):
    #     return validate_avatar(value)

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password) # Hash the password
        user.save()
        return user


class GetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'rank']

class UpdateUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    avatar = serializers.URLField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'avatar']

    def validate_username(self, value): # Username doğrulaması
        if self.instance and self.instance.username == value:
            return value
        return validate_username(value)
        
    def validate_email(self, value): # Email doğrulaması
        if self.instance and self.instance.email == value:
            return value
        return validate_email(value)

    # def validate_avatar(self, value): # Avatar doğrulaması
    #     return validate_avatar(value)

    def update(self, instance, validated_data):
        username = validated_data.get('username', instance.username) # Değer girilmemişse eski değerler seçilir.
        email = validated_data.get('email', instance.email)
        avatar = validated_data.get('avatar', instance.avatar)

        instance.username = username # Güncel değerler instance'a atılır
        instance.email = email
        instance.avatar = avatar

        instance.save()
        return instance
