import json
from channels.generic.websocket import WebsocketConsumer
from django.template.loader import render_to_string


class TimesConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(
            text_data='<div id="notifications" hx-swap-oob="beforeend">' +
            render_to_string("components/button.html", {"text": message}) +
            '</div>')
