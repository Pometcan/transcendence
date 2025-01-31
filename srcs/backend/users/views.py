from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status

from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework import mixins
from users.models import User, FriendshipRequest
from .serializers import GetUserSerializer, ReceivedFriendshipRequestSerializer, SentFriendshipRequestSerializer, BlockUserSerializer

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