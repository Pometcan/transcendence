
from rest_framework import serializers
from user.model import User

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    surname = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    username = serializers.CharField()
    avatar = serializers.URLField()
    create_date = serializers.DateTimeField(read_only=True)
    update_date = serializers.DateTimeField(read_only=True) 


    def create(self, validated_data):
        print(validated_data)
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.surname = validated_data.get('surname', instance.surname)
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)
        instance.username = validated_data.get('username', instance.username)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance