from django.shortcuts import render
from django.conf import settings
from django.contrib.auth import login
import requests
from django.core.files.base import ContentFile
import os
from dj_rest_auth.views import LoginView
from rest_framework import mixins, generics, status, permissions
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from users.models import User, FriendshipRequest
from .serializers import GetUserSerializer, AvatarSerializer, ReceivedFriendshipRequestSerializer, SentFriendshipRequestSerializer, BlockUserSerializer, FriendsSerializer
from users.permissions import RequestOwnerOrReadOnly
from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


AUTHORIZATION_URL = os.getenv('AUTHORIZATION_URL')
TOKEN_URL = os.getenv('TOKEN_URL')
USER_INFO_URL = os.getenv('USER_INFO_URL')
CLIENT_ID = settings.INTRA_CLIENT_ID
CLIENT_SECRET = settings.INTRA_CLIENT_SECRET
REDIRECT_URI = settings.INTRA_REDIRECT_URI


class IntraOAuthView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, action=None):
        if action == "login":
            return self.intra_login(request)
        elif action == "callback" or action is None:
            return self.intra_callback(request)
        return Response({"error": "Invalid action"}, status=400)
    
    def intra_login(self, request): # Kullanıcıyı 42 Intra giriş ekranına yönlendir
        state = "random_string"  # CSRF koruması için rastgele bir state belirle
        auth_url = (
            f"{AUTHORIZATION_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
            f"&response_type=code&scope=public&state={state}"
        )
        return Response({"auth_url": auth_url})

    def intra_callback(self, request): # 42 Intra'dan dönen kod ile token al ve kullanıcıyı giriş yap
        code = request.GET.get("code")
        if not code:
            return Response({"error": "Authorization code not provided"}, status=400)

        CustomLoginView.intra_oauth_login(request, code)
        return Response(
                {"detail": "Login başarılı.."},status=status.HTTP_200_OK)


class CustomLoginView(LoginView):
    @staticmethod 
    def intra_oauth_login(request, code):
        # Access token al
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
            return Response({"error": "Failed to retrieve access token"}, status=400)

        access_token = token_json["access_token"]

        # Kullanıcı bilgilerini çek
        user_response = requests.get(
            USER_INFO_URL, headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info = user_response.json()

        # Kullanıcıyı kaydet veya güncelle
        user, created = User.objects.update_or_create(
            id=user_info['id'],
            defaults={
                'username': user_info['login'],
                'email': user_info.get('email', ''),
            }
        )

        profile_image_url = user_info.get('image', {}).get('link', '')

        if created and profile_image_url:
            response = requests.get(profile_image_url)
            if response.status_code == 200:
                file_name = f"{user.username}_avatar.jpg"
                user.avatar.save(file_name, ContentFile(response.content), save=True)


        login(request, user)

        # return Response({
        #     'user': {
        #         'id': user.id,
        #         'username': user.username,
        #         'email': user.email,
        #     },
        #     'message': 'User registered successfully' if created else 'Login successful'
        # })
        return Response(
                {"detail": "Login başarılı.."},status=status.HTTP_200_OK)
                



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