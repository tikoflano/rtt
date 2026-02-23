FROM python:3.12-bookworm
SHELL ["/bin/bash", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - 

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    nano \
    nodejs

WORKDIR /src

COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

RUN cd frontend && npm install

ENV PATH="/src/frontend/node_modules/.bin:$PATH"

CMD python manage.py runserver 0.0.0.0:8000