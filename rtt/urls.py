"""rtt URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import re_path
from django.conf.urls import include
from . import views
from . import consumers


urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^api-auth/', include('rest_framework.urls')),
]

urlpatterns += [
    re_path(r'^server_datetime/', views.server_datetime),
    re_path(r'^logout/', views.do_logout),
]

urlpatterns += [
    re_path(r'^api/', include('api.urls', namespace='api')),
]

urlpatterns += [
    re_path(r'^.*/$', views.frontend),
]

websocket_urlpatterns = [
    re_path(r'ws/times/$', consumers.TimesConsumer.as_asgi()),
]
