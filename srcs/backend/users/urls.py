from django.urls import path, include

from .views import index, GetUserViewSet, ReceivedFriendshipRequestViewSet, SentFriendshipRequestViewSet, BlockUserViewSet, get_csrf_token
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'user-list',GetUserViewSet, basename='user')
router.register(r'received-friendship-request', ReceivedFriendshipRequestViewSet, basename='rec-friendship-req')
router.register(r'sent-friendship-request', SentFriendshipRequestViewSet, basename='sent-friendship-req')
router.register(r'block-users', BlockUserViewSet, basename='block-user')


urlpatterns = [
    path("", index, name="index"),
    path('', include(router.urls)),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
]
