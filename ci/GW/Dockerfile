FROM ubuntu:18.04

RUN apt-get update \
  && apt-get install --assume-yes --no-install-recommends \
  build-essential \
  ca-certificates \
  jq \
  libluajit-5.1-2 \
  lua-cjson \
  lua-cjson-dev \
  luarocks \
  python3-dev \
  python3-pip \
  python3-setuptools \
  python3 \
  wget \
  && apt-get clean \
  && rm --force --recursive /var/lib/apt/lists/*

# Build protobuf from source
#RUN wget --progress=dot:giga https://github.com/google/protobuf/releases/download/v3.1.0/protobuf-python-3.1.0.tar.gz
#RUN tar -xvzf protobuf-python-3.1.0.tar.gz
#RUN cd protobuf-3.1.0/ &&  ./configure -prefix=/usr && make && make install
#RUN cd protobuf-3.1.0/python && python3 setup.py build --cpp_implementation && python3 setup.py install --cpp_implementation

# Sphinx 1.5.2 breaks grpcio
RUN pip3 install -U pip
RUN pip3 install Sphinx==1.5.1
RUN pip3 install grpcio
RUN pip3 install protobuf
RUN python3 -m pip install grpcio
RUN python3 -m pip install protobuf

# Go install
RUN wget --progress=dot:giga https://golang.org/dl/go1.16.linux-amd64.tar.gz
RUN tar --directory=/usr/local --extract --gzip --file=go1.15.15.linux-amd64.tar.gz

RUN mkdir --parents \
  /develop/confs \
  /develop/go \
  /develop/start
COPY /entrypoint.sh /develop/start/entrypoint.sh
RUN chmod +x /develop/start/entrypoint.sh

ENV PATH=$PATH:/usr/local/go/bin
ENV GOPATH=/develop/go/

VOLUME [ "/develop/go", "/opt/tyk-gateway/tyk.conf", "/opt/tyk-gateway" ]

CMD [ "/develop/start/entrypoint.sh"]
EXPOSE 8080 443
