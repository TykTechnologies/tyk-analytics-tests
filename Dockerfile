FROM node:14

RUN apt-get update
RUN apt-get install -y libnss3-dev

RUN apt-get update -y && \
 apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release \
 net-tools xdg-utils wget xvfb ifupdown libgbm-dev
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get -y install ./google-chrome-stable_current_amd64.deb
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app

CMD DOCKER_IP=$(/sbin/ip route|awk '/default/ { print $3 }') npm run headless-test;
