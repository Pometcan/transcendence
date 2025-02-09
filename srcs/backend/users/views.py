import os
from django.conf import settings
from django.shortcuts import render
from django.urls import path
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import NotFound
from rest_framework import mixins, status, permissions
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware.csrf import get_token
from rest_framework.response import Response
from django.http import JsonResponse
from users.permissions import RequestOwnerOrReadOnly
from users.models import User, FriendshipRequest
from .serializers import LoginSerializer, \
                        OAuthLoginSerializer, \
                        TwoFAVerifySerializer, \
                        GetUserSerializer, \
                        AvatarSerializer, \
                        ReceivedFriendshipRequestSerializer, \
                        SentFriendshipRequestSerializer, \
                        BlockUserSerializer, \
                        FriendsSerializer, \
                        UserBasicInfoSerializer, \
                        SearcUserByUsernameSerializer



def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

AUTHORIZATION_URL = os.getenv('AUTHORIZATION_URL')
CLIENT_ID = settings.INTRA_CLIENT_ID
REDIRECT_URI = settings.INTRA_REDIRECT_URI

#LOGIN---------------------------------------------------------------------------
class AuthViewSet(GenericViewSet, mixins.CreateModelMixin):
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        return LoginSerializer

    def login(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            if user.mfa_enabled :
                try:
                    qr_code = user.generate_qr_code()
                    refresh = RefreshToken.for_user(user)
                    return Response({"mfa_enabled":user.mfa_enabled,
                                    "otp_secret": user.mfa_secret,
                                    "qr_code": qr_code,
                                    'refresh': str(refresh),
                                    'access': str(refresh.access_token),
                                    'user_id' : user.id,}, status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id' : user.id,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#INTRA AUTH-------------------------------------------------------------------------------
class IntraOAuthViewSet(GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = OAuthLoginSerializer

    def login(self, request):
        state = "random_string"
        auth_url = (
            f"{AUTHORIZATION_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
            f"&response_type=code&scope=public&state={state}"
        )
        return Response({"auth_url": auth_url})

    def callback(self, request):
        code = request.data.get("code")
        if not code:
            return Response({"error": "Authorization code not found."}, status=400)

        serializer = OAuthLoginSerializer(data={"code": code}, context={"request": request})
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#2FA----------------------------------------------------------------------------------

class TwoFAVerifyViewSet(GenericViewSet):
    serializer_class = TwoFAVerifySerializer
    permission_classes = [permissions.AllowAny]

    def verify(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Enable2FAViewSet(GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def enable(self, request, *args, **kwargs):
        user = request.user
        try:
            user.generate_otp_secret()
            user.mfa_enabled = True
            user.save()
            return Response({"otp_secret": user.mfa_secret}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Disable2FAViewSet(GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def disable(self, request, *args, **kwargs):
        user = request.user
        user.mfa_secret = ""
        user.mfa_enabled = False
        user.save()
        return Response({"message": "2FA has been disabled successfully."}, status=status.HTTP_200_OK)


#USER --------------------------------------------------------------------
class GetUserViewSet(
                mixins.ListModelMixin,
                mixins.RetrieveModelMixin,
                mixins.UpdateModelMixin,
                GenericViewSet):

    serializer_class = GetUserSerializer
    permission_classes = [IsAuthenticated, RequestOwnerOrReadOnly]

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
                {"detail": "Avatar kaldırıldı.",
                "avatar" : user.avatar.url},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Avatar silme işlemi başarısız oldu.", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_update(self, serializer):
        serializer.save()

class ReceivedFriendshipRequestViewSet(
                mixins.ListModelMixin,
                mixins.RetrieveModelMixin,
                mixins.UpdateModelMixin,
                GenericViewSet):

    serializer_class = ReceivedFriendshipRequestSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "sender_id"
    def get_queryset(self):
        user = self.request.user
        return FriendshipRequest.objects.select_related('sender').filter(receiver=user, is_active=True, status='P') \
                                        .exclude(sender__in=User.objects.filter(is_active=False)) \
                                        .exclude(sender__in=user.blocked_by.all()) \
                                        .exclude(sender__in=user.blocked_users.all())

    def get_object(self):
        sender_id = self.kwargs.get('sender_id') 
        if not sender_id:
            raise NotFound("Sender ID belirtilmedi.")

        user = self.request.user
        try:
            friendship_request = FriendshipRequest.objects.get(
                sender=sender_id,
                receiver=user,
                is_active=True,
                status='P'
            )
            serializer = self.get_serializer(instance=friendship_request)
            return serializer.instance  
        except FriendshipRequest.DoesNotExist:
            raise NotFound("Bu kullanıcıdan aktif bir arkadaşlık isteği bulunamadı.")
        
class SentFriendshipRequestViewSet(
                mixins.CreateModelMixin,
                mixins.RetrieveModelMixin,
                mixins.UpdateModelMixin,
                mixins.ListModelMixin,
                GenericViewSet):

    serializer_class = SentFriendshipRequestSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "receiver_id"

    def get_queryset(self):
        user = self.request.user
        return FriendshipRequest.objects.select_related('receiver').filter(sender=user, is_active=True, status='P') \
                                        .exclude(receiver__in=User.objects.filter(is_active=False)) \
                                        .exclude(receiver__in=user.blocked_by.all()) \
                                        .exclude(receiver__in=user.blocked_users.all())

    def get_object(self):
        receiver_id = self.kwargs.get('receiver_id') 
        if not receiver_id:
            raise NotFound("Receiver ID belirtilmedi.")

        user = self.request.user
        try:
            friendship_request = FriendshipRequest.objects.get(
                sender=user,
                receiver=receiver_id,
                is_active=True,
                status='P'
            )
            serializer = self.get_serializer(instance=friendship_request)
            return serializer.instance 
        except FriendshipRequest.DoesNotExist:
            raise NotFound("Bu kullanıcıya gönderilen aktif arkadaşlık isteği bulunamadı.")

class FriendsViewSet(
                mixins.RetrieveModelMixin,
                mixins.ListModelMixin,
                mixins.DestroyModelMixin,
                GenericViewSet): #yalnızca request userın arkadaşlarına ulaşılır / bir userın arkadaşlarını görmke için ekleme yapılmalı ??

    serializer_class = FriendsSerializer
    permission_classes = [IsAuthenticated]

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

    def get(self, request, *args, **kwargs):
        users = self.get_queryset()
        response_data = UserBasicInfoSerializer(users, many=True).data
        return Response(response_data)

class BlockUserViewSet(ModelViewSet):

    serializer_class = BlockUserSerializer
    permission_classes = [IsAuthenticated]

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

    def get(self, request, *args, **kwargs):
        users = self.get_queryset()
        response_data = UserBasicInfoSerializer(users, many=True).data
        return Response(response_data)



class SearchUserByUsernameViewSet(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserBasicInfoSerializer

    def get_queryset(self):
        search = self.request.query_params.get('search', '')
        user = self.request.user
        return User.objects.filter(is_active = True, username__icontains=search) \
                                    .exclude(id__in=user.blocked_by.all()) \
                                    .exclude(id__in=user.blocked_users.all())

    def get(self, request, *args, **kwargs):
        users = self.get_queryset()
        response_data = UserBasicInfoSerializer(users, many=True).data
        return Response(response_data)
