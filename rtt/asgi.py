"""
ASGI config for rtt project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

from api.constants import SSE_CHANNEL_DESCENTS
from . import urls
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path, re_path
import django_eventstream

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rtt.settings')
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()


application = ProtocolTypeRouter({
    'http': URLRouter([
        path('events/', AuthMiddlewareStack(
            URLRouter(django_eventstream.routing.urlpatterns)
        ), {'channels': [SSE_CHANNEL_DESCENTS]}),
        re_path(r'', get_asgi_application()),
    ]),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                urls.websocket_urlpatterns
            )
        )
    ),
})
