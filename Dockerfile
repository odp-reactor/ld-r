FROM node:14 AS builder


# Update aptitude with new repo
RUN apt-get update
# Install software
RUN apt-get install -y git


# clone codebase
RUN git clone https://github.com/ODPReactor/ld-r.git /ld-r
WORKDIR /ld-r

# install webpack and dependencies
RUN npm install webpack -g
RUN npm install

# build software
RUN npm run build:nostart



# create runner
FROM node:14

COPY --from=builder /ld-r /ld-r
WORKDIR /ld-r
ENTRYPOINT ["npm", "start"]
