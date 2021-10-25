FROM ubuntu:18.04

SHELL [ "/bin/bash", "-o", "pipefail", "-c" ]

RUN apt-get update --assume-yes \
  && apt-get install --assume-yes --no-install-recommends \
  ca-certificates \
  curl \
  && apt-get clean \
  && rm --force --recursive /var/lib/apt/lists/*

RUN curl --location --silent https://deb.nodesource.com/setup_10.x | bash -

RUN apt-get update --assume-yes \
  && apt-get install --assume-yes --no-install-recommends \
  build-essential \
  bzip2 \
  git \
  libluajit-5.1-2 \
  libpython3.5 \
  luarocks \
  nodejs \
  python3-dev \
  python3-pip \
  python3-setuptools \
  python3 \
  vim \
  wget \
  && apt-get clean \
  && rm --force --recursive /var/lib/apt/lists/*

RUN curl --location --silent https://golang.org/dl/go1.14.12.linux-amd64.tar.gz --output go.tar.gz
RUN tar --directory=/usr/local --extract --gzip --file=go.tar.gz

RUN mkdir --parents \
  /develop/confs \
  /develop/go \
  /develop/start
COPY data/entrypoint.sh /develop/start/entrypoint.sh
COPY data/entrypoint.sh /develop/start/entrypoint.sh
RUN chmod +x /develop/start/entrypoint.sh

ENV PATH=$PATH:/usr/local/go/bin
ENV GOPATH=/develop/go

VOLUME [ "/develop/go/src", "/opt/tyk-dashboard/tyk_analytics.conf" ]

CMD [ "/develop/start/entrypoint.sh" ]
EXPOSE 8080 443