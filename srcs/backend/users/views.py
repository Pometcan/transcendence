from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status

from rest_framework import mixins, generics
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from users.models import User, FriendshipRequest
from .serializers import GetUserSerializer, AvatarSerializer, ReceivedFriendshipRequestSerializer, SentFriendshipRequestSerializer, BlockUserSerializer, FriendsSerializer
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from users.permissions import RequestOwnerOrReadOnly

from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


class GetUserViewSet(
                mixins.ListModelMixin,
                mixins.RetrieveModelMixin,
                mixins.UpdateModelMixin,
                GenericViewSet):

    serializer_class = GetUserSerializer
    permission_classes = [IsAuthenticated, RequestOwnerOrReadOnly]
    queryset = User.objects.none()

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(is_active=True) \
                            .exclude(id__in=user.blocked_by.all()) \
                            .exclude(id__in=user.blocked_users.all())


class AvatarViewSet(mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.RetrieveModelMixin,
                    GenericViewSet):

    serializer_class = AvatarSerializer
    permission_classes = [IsAuthenticated, RequestOwnerOrReadOnly]

    def get_object(self):
        return self.request.user

    def destroy(self, request, *args, **kwargs):
        serializer = self.get_serializer()
        user = self.get_object()
        try:
            serializer.delete(user)
            return Response(
                {"detail": "Avatar kaldırıldı."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Avatar silme işlemi başarısız oldu.", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )



class ReceivedFriendshipRequestViewSet(
                mixins.ListModelMixin,
                mixins.RetrieveModelMixin,
                mixins.UpdateModelMixin,
                GenericViewSet):

    serializer_class = ReceivedFriendshipRequestSerializer
    permission_classes = [IsAuthenticated]
    gueryset = FriendshipRequest.objects.none()

    def get_queryset(self):
        user = self.request.user
        return FriendshipRequest.objects.select_related('sender').filter(receiver=user, is_active=True, status='P') \
                                        .exclude(sender__in=User.objects.filter(is_active=False)) \
                                        .exclude(sender__in=user.blocked_by.all()) \
                                        .exclude(sender__in=user.blocked_users.all())


class SentFriendshipRequestViewSet(
                mixins.CreateModelMixin,
                mixins.RetrieveModelMixin,
                mixins.UpdateModelMixin,
                mixins.ListModelMixin,
                GenericViewSet):

    serializer_class = SentFriendshipRequestSerializer
    permission_classes = [IsAuthenticated]
    gueryset = FriendshipRequest.objects.none()

    def get_queryset(self):
        user = self.request.user
        return FriendshipRequest.objects.select_related('receiver').filter(sender=user, is_active=True, status='P') \
                                        .exclude(receiver__in=User.objects.filter(is_active=False)) \
                                        .exclude(receiver__in=user.blocked_by.all()) \
                                        .exclude(receiver__in=user.blocked_users.all())

class FriendsViewSet(
                mixins.RetrieveModelMixin,
                mixins.ListModelMixin,
                mixins.DestroyModelMixin,
                GenericViewSet): #yalnızca request userın arkadaşlarına ulaşılır / bir userın arkadaşlarını görmke için ekleme yapılmalı ??

    serializer_class = FriendsSerializer
    permission_classes = [IsAuthenticated]
    gueryset = User.objects.none()

    def get_queryset(self):
        user_instance = self.request.user
        return user_instance.friends.filter(is_active=True)

    def destroy(self, request, pk=None, *args, **kwargs):
        data = {'friend_id': pk}
        serializer = FriendsSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            friend = serializer.delete(serializer.validated_data)
            return Response(
                {"detail": f"{friend.username} arkadaşlar listesinden çıkarıldı."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlockUserViewSet(ModelViewSet):

    serializer_class = BlockUserSerializer
    permission_classes = [IsAuthenticated]
    gueryset = User.objects.none()

    def get_queryset(self):
        user_instance = self.request.user
        return user_instance.blocked_users.filter(is_active=True)

    def destroy(self, request, pk=None, *args, **kwargs):
        data = {'blocked_user_id': pk}
        serializer = BlockUserSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            blocked_user = serializer.delete(serializer.validated_data)
            return Response(
                {"detail": f"{blocked_user.username} engellenenler listesinden çıkarıldı."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
