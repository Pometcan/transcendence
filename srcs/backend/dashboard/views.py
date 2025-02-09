from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from users.models import User, UserStats
from game.models import GameDB, TMPGameDB


def general_stats_api(request):
    """Genel istatistikleri JSON olarak döndüren view."""
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    total_games = GameDB.objects.count()
    ongoing_games = TMPGameDB.objects.count()

    data = {
        'total_users': total_users,
        'active_users': active_users,
        'total_games': total_games,
        'ongoing_games': ongoing_games,
    }
    return JsonResponse(data)

# dashboard/views.py
def test_api(request):
    return JsonResponse({'message': 'Test başarılı!'})
