from django.http import HttpResponse
from json import json_dumps


class JsonResponse(HttpResponse):

    def __init__(self, content):
        super().__init__(json_dumps(content), content_type="application/json")
