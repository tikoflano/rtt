from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse


def server_datetime(request):
    return JsonResponse({'datetime': timezone.now().strftime(
        '%Y-%m-%dT%H:%M:%S.%f')[: -4] + "Z"})


def frontend(request):
    return render(request, 'index.html')
