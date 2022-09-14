from django.shortcuts import render, redirect
from django.utils import timezone
from django.http import JsonResponse
from django.contrib.auth import logout


def server_datetime(request):
    return JsonResponse({'datetime': timezone.now().strftime(
        '%Y-%m-%dT%H:%M:%S.%f')[: -4] + "Z"})


def do_logout(request):
    logout(request)
    return redirect('/login')


def frontend(request):
    return render(request, 'index.html')
