from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello friend, hello friend. That's lame. Maybe I should give you a name.")