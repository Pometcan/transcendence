from django.contrib.auth.models import User
from django.http import JsonResponse

def User_database(request):
    users = list(User.objects.values("id", "username", "email", "is_staff" ))
    return JsonResponse(users, safe=False)
