from django.apps import AppConfig


class ApiAppConfig(AppConfig):
    name = "api"
    verbose_name = "API module"

    def ready(self):
        import api.signals
