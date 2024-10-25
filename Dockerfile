FROM ubuntu:focal

RUN /usr/bin/apt-get update && \
    /usr/bin/apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    /usr/bin/apt-get update && \
    /usr/bin/apt-get upgrade && \
    /usr/bin/apt-get install -y nodejs ffmpeg

WORKDIR /home/app

RUN npm i -g nodemon

CMD [ "nodemon", "index.js" ]