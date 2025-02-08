import os
import pyotp
import qrcode
import base64
from io import BytesIO
from django.conf import settings
from django.shortcuts import render
from django.urls import path
from rest_framework.decorators import action
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
                        FriendsSerializer



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
            
            if user.mfa_enabled:
                return Response({"2fa_required": True, "otp_secret": user.mfa_secret}, status=status.HTTP_200_OK)
            
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

    def login(self, request):
        state = "random_string"
        auth_url = (
            f"{AUTHORIZATION_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
            f"&response_type=code&scope=public&state={state}"
        )
        return Response({"auth_url": auth_url})

    def callback(self, request):
        code = request.GET.get("code")
        if not code:
            return Response({"error": "Authorization code not provided"}, status=400)
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

            otp_uri = pyotp.totp.TOTP(user.mfa_secret).provisioning_uri(user.email, issuer_name="PONG")
            qr = qrcode.make(otp_uri)
            buffered = BytesIO()
            qr.save(buffered, format="PNG")
            qr_b64 = base64.b64encode(buffered.getvalue()).decode()
            
            return Response({"otp_secret": user.mfa_secret, "qr_code": qr_b64}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Disable2FAViewSet(GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def disable(self, request, *args, **kwargs):
        user = request.user
        user.mfa_secret = ""
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