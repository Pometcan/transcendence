from django.urls import path, include

from .views import index, GetUserViewSet, ReceivedFriendshipRequestViewSet, SentFriendshipRequestViewSet
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'user-list',GetUserViewSet, basename='user')
router.register(r'received-friendship-request', ReceivedFriendshipRequestViewSet, basename='rec-friendship-req')
router.register(r'sent-friendship-request', SentFriendshipRequestViewSet, basename='sent-friendship-req')


urlpatterns = [
    path("", index, name="index"),
    path('', include(router.urls)),

]