from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse


def server_datetime(request):
    return JsonResponse({'datetime': timezone.now()})


def frontend(request):
    return render(request, 'index.html')
