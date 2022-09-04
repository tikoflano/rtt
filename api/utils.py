from datetime import datetime


def millisecondsDate(value):
    return datetime.strptime(
        value.strftime('%Y-%m-%d %H:%M:%S.%f')[: -4],
        '%Y-%m-%d %H:%M:%S.%f')
