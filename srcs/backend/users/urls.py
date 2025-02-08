from django.urls import path, include

from .views import  AuthViewSet, IntraOAuthViewSet, TwoFAVerifyViewSet, Enable2FAViewSet, Disable2FAViewSet, GetUserViewSet, AvatarViewSet, ReceivedFriendshipRequestViewSet, SentFriendshipRequestViewSet, BlockUserViewSet, FriendsViewSet, get_csrf_token
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'user-list',GetUserViewSet, basename='user')
router.register(r'received-friendship-request', ReceivedFriendshipRequestViewSet, basename='rec-friendship-req')
router.register(r'sent-friendship-request', SentFriendshipRequestViewSet, basename='sent-friendship-req')
router.register(r'block-users', BlockUserViewSet, basename='block-user')
router.register(r'friends', FriendsViewSet, basename = 'friend')


urlpatterns = [
    path('', include(router.urls)),
    #login
    path('login/', AuthViewSet.as_view({'post':'login'}), name='api-login'),

    path('csrf/', get_csrf_token, name='get_csrf_token'),

    #Intra Auth
    path('intra/login/', IntraOAuthViewSet.as_view({'get': 'login'}), name='intra-login'),
    path('intra/42-auth/', IntraOAuthViewSet.as_view({'post': 'callback'}), name='intra-callback'),

    #2FA
    path('2fa-enable', Enable2FAViewSet.as_view({'get': 'enable'}), name='2fa-enable'),
    path('2fa-disable', Disable2FAViewSet.as_view({'get': 'disable'}), name='2fa-disable'),
    path('2fa-verify', TwoFAVerifyViewSet.as_view({'post' : 'verify'}), name='2fa-verify'),
  
    path('avatar/', AvatarViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='avatar'),
]
