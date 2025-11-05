# Whanos Base and Standalone Images

This  part of documentation explains the purpose and usage of the Dockerfiles.
Each language has two Dockerfiles:

- `Dockerfile.base` — a minimal base image containing language runtimes and build tools used to build application images and speed up CI jobs.
- `Dockerfile.standalone` — a self-contained image that includes a small example app and is suitable for local testing or deployment.

## General contract

- Inputs: the Dockerfiles in `images/<language>/` and the small example apps in their respective `app/` subfolders.
- Outputs: two image variants per language:
  - `whanos-<language>-base` (used as a shared build/runtime layer)
  - `whanos-<language>-standalone` (runs the example app)
- Success criteria: both base and standalone images build without errors and the standalone image starts and serves the example app's expected output.

Edge cases:
- Missing example app files (build will fail) — verify `images/<language>/app/` exists.
- Network restrictions when pulling base images — use a proxied registry if necessary.
- Large dependency installs — consider caching or multi-stage builds to reduce final image size.

---

## Python

Location:

### Base

```
FROM python:3.12-alpine

WORKDIR /app

RUN apk add --no-cache bash && \
    python -m ensurepip --upgrade && \
    pip install --no-cache-dir --upgrade pip setuptools && \
    rm -rf /root/.cache

SHELL ["/bin/bash", "-c"]
```
### standalone

```
FROM python:3.12-alpine

WORKDIR /app
RUN apk add --no-cache bash && \
    python -m ensurepip --upgrade && \
    pip install --no-cache-dir --upgrade pip setuptools && \
    rm -rf /root/.cache
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt && \
    rm -rf /root/.cache
COPY . .
SHELL ["/bin/bash", "-c"]
CMD ["python", "-m", "app"]

```
#### Purpose:
- Dockerfile.base: provides a Python runtime and common build tooling (pip, virtualenv). Intended to be the base layer for building Python apps in CI.
- Dockerfile.standalone: copies the example app and its `requirements.txt`, installs dependencies, and runs the module (e.g. `python -m package` or `python __main__.py`).

How to build locally:

```bash
# Build base image
docker build -f images/python/Dockerfile.base -t whanos-python-base images/python
# Build standalone image
docker build -f images/python/Dockerfile.standalone -t whanos-python-standalone images/python
# Run standalone (example)
docker run --rm whanos-python-standalone
```

---

## Befunge

### Base
```
FROM debian:12-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        bash \
        curl \
        git \
        gcc \
        make \
        libc6-dev \
        ca-certificates && \
    git clone https://github.com/catseye/Befunge-93.git /tmp/befunge && \
    cd /tmp/befunge && \
    make && \
    cp bin/bef /usr/local/bin/befunge93 && \
    cd / && \
    rm -rf /tmp/befunge && \
    apt-get remove -y git gcc make libc6-dev && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-c"]
```
### Standalone
```
FROM debian:12-slim AS builder

WORKDIR /build
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        gcc \
        make \
        libc6-dev \
        ca-certificates && \
    git clone https://github.com/catseye/Befunge-93.git /tmp/befunge && \
    cd /tmp/befunge && \
    make && \
    cp bin/bef /usr/local/bin/befunge93 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

FROM debian:12-slim


WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        bash \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/bin/befunge93 /usr/local/bin/befunge93
COPY app/*.bf .
SHELL ["/bin/bash", "-c"]
CMD ["befunge93", "main.bf"]
```

#### Purpose
- Dockerfile.base: contains a small Befunge interpreter or runtime environment used as the shared layer for building/running Befunge programs.
- Dockerfile.standalone: copies the sample `.bf` program into the image and sets the interpreter command as the container entrypoint to execute the program.

How to build locally:

```bash
docker build -f images/befunge/Dockerfile.base -t whanos-befunge-base images/befunge
docker build -f images/befunge/Dockerfile.standalone -t whanos-befunge-standalone images/befunge

docker run --rm whanos-befunge-standalone
```

---

## Java

### Base

```
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

RUN apk add --no-cache bash maven && \
    rm -rf /var/cache/apk/* && \
    rm -rf /root/.m2/repository

SHELL ["/bin/bash", "-c"]

```

### Standalone
```
FROM eclipse-temurin:21-jdk-alpine AS builder


WORKDIR /app
RUN apk add --no-cache bash maven && \
    rm -rf /var/cache/apk/*
COPY app/pom.xml ./
RUN mvn dependency:go-offline -B
COPY app ./
RUN mvn package -DskipTests && \
    rm -rf /root/.m2/repository


FROM eclipse-temurin:21-jre-alpine


WORKDIR /app
RUN apk add --no-cache bash && \
    rm -rf /var/cache/apk/*
COPY --from=builder /app/target/*.jar app.jar
SHELL ["/bin/bash", "-c"]
CMD ["java", "-jar", "app.jar"]

```
#### Purpose:

- Dockerfile.base: provides a JDK and build tools (usually Maven) used for compiling Java projects.
- Dockerfile.standalone: typically a multi-stage Dockerfile that builds the app with Maven then copies the resulting JAR into a smaller runtime image.

How to build locally:

```bash

docker build -f images/java/Dockerfile.base -t whanos-java-base images/java

docker build -f images/java/Dockerfile.standalone -t whanos-java-standalone images/java

docker run --rm whanos-java-standalone
```

Notes:
- The standalone Dockerfile often contains a build stage that requires a larger image (openjdk + maven) and a final slimmer runtime stage (openjdk:jre or eclipse-temurin:jre).
- Ensure the Maven build produces an executable JAR, or update the entrypoint to the correct `java -jar /path/app.jar` command.

---

## JavaScript

### Base

```
FROM node:20.9-alpine
WORKDIR /app
RUN apk add --no-cache bash && \
    rm -rf /var/cache/apk/*
SHELL ["/bin/bash", "-c"]

```

### Standalone
```
FROM node:20.9-alpine
WORKDIR /app
RUN apk add --no-cache bash && \
    rm -rf /var/cache/apk/*
COPY package*.json ./
RUN npm install --omit=dev && \
    npm cache clean --force
COPY . .
SHELL ["/bin/bash", "-c"]
CMD ["node", "."]
```
#### Purpose :
 
- Dockerfile.base: provides a Node.js runtime and common tooling (npm or yarn). Useful as a shared layer in CI to cache npm installs.
- Dockerfile.standalone: installs `package.json` dependencies and copies the example `app.js` then sets `node app.js` as the entrypoint.

How to build locally:

```bash
docker build -f images/javascript/Dockerfile.base -t whanos-javascript-base images/javascript
docker build -f images/javascript/Dockerfile.standalone -t whanos-javascript-standalone images/javascript
docker run --rm -p 3000:3000 whanos-javascript-standalone

```


---

## Building and pushing to the local registry

If you are using the local registry deployed by the Whanos deployment (default `REGISTRY_URL` points to `MASTER_IP:5000`), tag and push images like this:

```bash
docker tag whanos-python-base ${REGISTRY_URL}/whanos-python:base
docker push ${REGISTRY_URL}/whanos-python:base
```
