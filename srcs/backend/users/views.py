from django.shortcuts import render

from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins
from users.models import User, FriendshipRequest
from .serializers import GetUserSerializer, ReceivedFriendshipRequestSerializer, SentFriendshipRequestSerializer

from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from users.permissions import RequestOwnerOrReadOnly

from django.http import HttpResponse
def index(request):
    return HttpResponse("Hello, world. You're at the user index.")


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
        return FriendshipRequest.objects.filter(receiver=user, is_active=True, status='P') \
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
        return FriendshipRequest.objects.filter(sender=user, is_active=True, status='P') \
                                        .exclude(receiver__in=User.objects.filter(is_active=False)) \
                                        .exclude(receiver__in=user.blocked_by.all()) \
                                        .exclude(receiver__in=user.blocked_users.all())
    
    def perform_create(self, serializer):
        sender = self.request.user
        serializer.save(sender=sender)


    
