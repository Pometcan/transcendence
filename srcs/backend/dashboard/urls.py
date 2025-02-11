# dashboard/urls.py

from django.urls import path
from . import views
from .views import GameDBStatsAPIView, TMPGameDBStatsAPIView, GameDBEventsAPIView

urlpatterns = [
    path('api/general/', views.general_stats_api, name='general_stats_api'),
    path('games/db/<int:game_id>/stats/', GameDBStatsAPIView.as_view(), name='game-db-stats-api'), # GameDB için class-based view
    path('games/tmp/<int:game_id>/stats/', TMPGameDBStatsAPIView.as_view(), name='tmp-game-db-stats-api'), # TMPGameDB için class-based view (YENİ)
    path('games/db/<int:game_db_id>/events/', GameDBEventsAPIView.as_view(), name='game-db-events-api'),
    path('user/stats/', views.user_stats_dashboard_api, name='user_stats_dashboard_api'),
]
