from django.urls import path, include

from .views import index, GetUserViewSet, AvatarViewSet, ReceivedFriendshipRequestViewSet, SentFriendshipRequestViewSet, BlockUserViewSet, FriendsViewSet 
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'user-list',GetUserViewSet, basename='user')

router.register(r'received-friendship-request', ReceivedFriendshipRequestViewSet, basename='rec-friendship-req')
router.register(r'sent-friendship-request', SentFriendshipRequestViewSet, basename='sent-friendship-req')
router.register(r'block-users', BlockUserViewSet, basename='block-user')
router.register(r'friends', FriendsViewSet, basename = 'friend')


urlpatterns = [
    path("", index, name="index"),
    path('', include(router.urls)),
    path('avatar/', AvatarViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='avatar'), 
]