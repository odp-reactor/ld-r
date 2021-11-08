FROM node:14 AS builder

# Update aptitude with new repo
RUN apt-get update

# clone codebase
RUN git clone https://github.com/ODPReactor/ld-r.git /ld-r
WORKDIR /ld-r

# install webpack and dependencies
RUN npm install webpack -g
RUN npm install

# mapping build environemnt
ARG PUBLIC_URL
ARG CONFIG_SPARQL_ENDPOINT_URI
ARG CONFIG_SPARQL_ENDPOINT_HOST
ARG CONFIG_SPARQL_ENDPOINT_PATH
ARG CONFIG_SPARQL_ENDPOINT_PORT
ARG CONFIG_SPARQL_ENDPOINT_TYPE
ARG CONFIG_SPARQL_ENDPOINT_PROTOCOL
ARG CONFIG_GRAPH
ARG ODP_REACTOR_GRAPH_HOST
ARG ODP_REACTOR_GRAPH_PORT
ARG ODP_REACTOR_SERVER_URL

# build software
RUN npm run build:nostart



# create runner
FROM node:14

COPY --from=builder /ld-r /ld-r
WORKDIR /ld-r
ENTRYPOINT ["npm", "start"]
