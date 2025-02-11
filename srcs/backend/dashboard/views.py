from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from users.models import User, UserStats #senemden gelicek olanlar
from rest_framework import generics # generics importu zaten var
from rest_framework.decorators import api_view, permission_classes # fonksiyon bazlı view'lar için decorators
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, DjangoModelPermissionsOrAnonReadOnly # İzin sınıfları
from game.models import GameDB, TMPGameDB, GameEvent
from .serializers import GameDBSerializer, TMPGameDBSerializer, GameEventSerializer
from rest_framework.permissions import IsAuthenticated


@login_required
def general_stats_api(request):
    """Genel istatistikleri JSON olarak döndüren view."""
    total_users = User.objects.count() #toplam user sayısını döndürüyor sie
    active_users = User.objects.filter(is_active=True).count() #active users sayısı dönüyor
    total_games = GameDB.objects.count() # toplam oynanan oyun sayısı
    ongoing_games = TMPGameDB.objects.count() # toplam oynanan kullanıcı a

    data = {
        'total_users': total_users, #toplam kullainici
        'active_users': active_users, #aktif kullanici
        'total_games': total_games,     #toplam oynanan oyun
        'ongoing_games': ongoing_games, #anlık devam eden oyun sayısı
    }
    return JsonResponse(data)


class GameDBStatsAPIView(generics.RetrieveAPIView): # GameDB icinden istedigin bir oyunun kaydını alır
    queryset = GameDB.objects.all()
    serializer_class = GameDBSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    lookup_url_kwarg = 'game_id'



class TMPGameDBStatsAPIView(generics.RetrieveAPIView):  # devam eden bir oyunun verilerini alıyoruz.
    queryset = TMPGameDB.objects.all() # TMPGameDB queryset'ini belirtiyoruz
    serializer_class = TMPGameDBSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly] # Model izinleri
    lookup_url_kwarg = 'game_id' # URL parametresinin adı


class GameDBEventsAPIView(generics.ListAPIView): # GameEvent listesi için class-based view (zaten class-based)
    serializer_class = GameEventSerializer
    permission_classes = [AllowAny] # İzin sınıfı (gereksinimine göre değiştirilebilir)

    def get_queryset(self):
        game_db_id = self.kwargs['game_db_id']
        return GameEvent.objects.filter(game_db_id=game_db_id)

@api_view(['GET']) # Sadece GET isteklerini kabul eder
@permission_classes([IsAuthenticated]) # Sadece giriş yapmış kullanıcılar erişebilir
def user_stats_dashboard_api(request):
    user = request.user
    user_id = user.id

    games_player1 = GameDB.objects.filter(player1_id=str(user_id))
    games_player2 = GameDB.objects.filter(player2_id=str(user_id))
    all_games = list(games_player1) + list(games_player2)

    total_games_played = len(all_games)
    wins = 0
    losses = 0
    total_score = 0
    max_score = 0

    for game in all_games:
        if str(game.winner_id) == str(user_id):
            wins += 1
        else:
            losses += 1

        if str(game.player1_id) == str(user_id):
            total_score += game.player1_score
            max_score = max(max_score, game.player1_score)
        elif str(game.player2_id) == str(user_id):
            total_score += game.player2_score
            max_score = max(max_score, game.player2_score)

    win_rate = (wins / total_games_played) * 100 if total_games_played > 0 else 0
    average_score = total_score / total_games_played if total_games_played > 0 else 0

    game_type_counts = {}
    game_mode_counts = {}
    for game in all_games:
        game_type = game.game_type or 'default'
        game_mode = game.game_mode or 'default'
        game_type_counts[game_type] = game_type_counts.get(game_type, 0) + 1
        game_mode_counts[game_mode] = game_mode_counts.get(game_mode, 0) + 1

    rank_history_data = [] # Şimdilik boş

    recent_games_data = []
    recent_games = sorted(all_games, key=lambda game: game.create_date, reverse=True)
    for game in recent_games:
        recent_games_data.append({
            'room_id': game.room_id,
            'player1_id': game.player1_id,
            'player2_id': game.player2_id,
            'winner_id': game.winner_id,
            'create_date': game.create_date, # Frontend'e gönderirken formatlama gerekebilir
            'game_type': game.game_type,
            'game_mode': game.game_mode,
        })


    response_data = {
        'total_games_played': total_games_played,
        'wins': wins,
        'losses': losses,
        'win_rate': win_rate,
        'average_score': average_score,
        'max_score': max_score,
        'game_type_counts': game_type_counts, # Frontend'de grafik için uygun formatta
        'game_mode_counts': game_mode_counts,
        'rank_history_data': rank_history_data,
        'recent_games': recent_games_data, # Son oyun verileri (liste)
    }

    return JsonResponse(response_data)