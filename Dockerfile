FROM node:14 AS builder


# Update aptitude with new repo
RUN apt-get update
# Install software
RUN apt-get install -y git

RUN mkdir /ld-r
WORKDIR /ld-r

RUN npm install webpack -g

ADD package.json /ld-r/
RUN npm install

ADD . /ld-r

# build software
RUN npm run build:nostart



FROM node:14

COPY --from=builder /ld-r /ld-r
WORKDIR /ld-r
ENTRYPOINT ["npm", "start"]