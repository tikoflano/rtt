FROM python:3.10-bullseye
SHELL ["/bin/bash", "-c"]

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    nano

WORKDIR /src

ADD ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash &&\
    source /root/.bashrc &&\
    nvm install v16.16.0 &&\
    npm install -g npm@8.17.0 &&\
    npm install

ENV PATH="/src/app/node_modules/.bin:$PATH"

CMD python manage.py runserver 0.0.0.0:8000