from django.urls import re_path
from django.conf.urls import include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter
import api.views as views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

app_name = 'api'

router = DefaultRouter()
router.register(r'pilots', views.PilotViewSet, basename='pilots')
router.register(r'races', views.RaceViewSet, basename='races')

races_router = NestedSimpleRouter(router, r'races', lookup='race')
races_router.register(r'pilots', views.RacePilotViewSet,
                      basename='race_pilots')
races_router.register(r'descents', views.RaceDescentViewSet,
                      basename='race_descents')


urlpatterns = [
    re_path(r'schema/$', SpectacularAPIView.as_view(), name='schema'),
    re_path(r'schema/swagger/$', SpectacularSwaggerView.as_view(url_name='api:schema'), name='swagger-ui'),
    re_path(r'schema/redoc/$', SpectacularRedocView.as_view(url_name='api:schema'), name='redoc'),
    re_path(r'', include(router.urls)),
    re_path(r'', include(races_router.urls)),
]
