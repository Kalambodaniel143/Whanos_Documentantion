import{_ as s,c as n,o as e,ae as p}from"./chunks/framework.CyJo7YO6.js";const k=JSON.parse('{"title":"Whanos Base and Standalone Images","description":"","frontmatter":{},"headers":[],"relativePath":"Devs/Images.md","filePath":"Devs/Images.md"}'),i={name:"Devs/Images.md"};function l(t,a,h,o,c,r){return e(),n("div",null,[...a[0]||(a[0]=[p(`<h1 id="whanos-base-and-standalone-images" tabindex="-1">Whanos Base and Standalone Images <a class="header-anchor" href="#whanos-base-and-standalone-images" aria-label="Permalink to &quot;Whanos Base and Standalone Images&quot;">​</a></h1><p>This part of documentation explains the purpose and usage of the Dockerfiles. Each language has two Dockerfiles:</p><ul><li><code>Dockerfile.base</code> — a minimal base image containing language runtimes and build tools used to build application images and speed up CI jobs.</li><li><code>Dockerfile.standalone</code> — a self-contained image that includes a small example app and is suitable for local testing or deployment.</li></ul><h2 id="general-contract" tabindex="-1">General contract <a class="header-anchor" href="#general-contract" aria-label="Permalink to &quot;General contract&quot;">​</a></h2><ul><li>Inputs: the Dockerfiles in <code>images/&lt;language&gt;/</code> and the small example apps in their respective <code>app/</code> subfolders.</li><li>Outputs: two image variants per language: <ul><li><code>whanos-&lt;language&gt;-base</code> (used as a shared build/runtime layer)</li><li><code>whanos-&lt;language&gt;-standalone</code> (runs the example app)</li></ul></li><li>Success criteria: both base and standalone images build without errors and the standalone image starts and serves the example app&#39;s expected output.</li></ul><p>Edge cases:</p><ul><li>Missing example app files (build will fail) — verify <code>images/&lt;language&gt;/app/</code> exists.</li><li>Network restrictions when pulling base images — use a proxied registry if necessary.</li><li>Large dependency installs — consider caching or multi-stage builds to reduce final image size.</li></ul><hr><h2 id="python" tabindex="-1">Python <a class="header-anchor" href="#python" aria-label="Permalink to &quot;Python&quot;">​</a></h2><p>Location:</p><h3 id="base" tabindex="-1">Base <a class="header-anchor" href="#base" aria-label="Permalink to &quot;Base&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FROM python:3.12-alpine</span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RUN apk add --no-cache bash &amp;&amp; \\</span></span>
<span class="line"><span>    python -m ensurepip --upgrade &amp;&amp; \\</span></span>
<span class="line"><span>    pip install --no-cache-dir --upgrade pip setuptools &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /root/.cache</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SHELL [&quot;/bin/bash&quot;, &quot;-c&quot;]</span></span></code></pre></div><h3 id="standalone" tabindex="-1">standalone <a class="header-anchor" href="#standalone" aria-label="Permalink to &quot;standalone&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FROM python:3.12-alpine</span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span>RUN apk add --no-cache bash &amp;&amp; \\</span></span>
<span class="line"><span>    python -m ensurepip --upgrade &amp;&amp; \\</span></span>
<span class="line"><span>    pip install --no-cache-dir --upgrade pip setuptools &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /root/.cache</span></span>
<span class="line"><span>COPY requirements.txt ./</span></span>
<span class="line"><span>RUN pip install --no-cache-dir -r requirements.txt &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /root/.cache</span></span>
<span class="line"><span>COPY . .</span></span>
<span class="line"><span>SHELL [&quot;/bin/bash&quot;, &quot;-c&quot;]</span></span>
<span class="line"><span>CMD [&quot;python&quot;, &quot;-m&quot;, &quot;app&quot;]</span></span></code></pre></div><h4 id="purpose" tabindex="-1">Purpose: <a class="header-anchor" href="#purpose" aria-label="Permalink to &quot;Purpose:&quot;">​</a></h4><ul><li>Dockerfile.base: provides a Python runtime and common build tooling (pip, virtualenv). Intended to be the base layer for building Python apps in CI.</li><li>Dockerfile.standalone: copies the example app and its <code>requirements.txt</code>, installs dependencies, and runs the module (e.g. <code>python -m package</code> or <code>python __main__.py</code>).</li></ul><p>How to build locally:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Build base image</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/python/Dockerfile.base</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-python-base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/python</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Build standalone image</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/python/Dockerfile.standalone</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-python-standalone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/python</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Run standalone (example)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --rm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-python-standalone</span></span></code></pre></div><hr><h2 id="befunge" tabindex="-1">Befunge <a class="header-anchor" href="#befunge" aria-label="Permalink to &quot;Befunge&quot;">​</a></h2><h3 id="base-1" tabindex="-1">Base <a class="header-anchor" href="#base-1" aria-label="Permalink to &quot;Base&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FROM debian:12-slim</span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RUN apt-get update &amp;&amp; \\</span></span>
<span class="line"><span>    apt-get install -y --no-install-recommends \\</span></span>
<span class="line"><span>        bash \\</span></span>
<span class="line"><span>        curl \\</span></span>
<span class="line"><span>        git \\</span></span>
<span class="line"><span>        gcc \\</span></span>
<span class="line"><span>        make \\</span></span>
<span class="line"><span>        libc6-dev \\</span></span>
<span class="line"><span>        ca-certificates &amp;&amp; \\</span></span>
<span class="line"><span>    git clone https://github.com/catseye/Befunge-93.git /tmp/befunge &amp;&amp; \\</span></span>
<span class="line"><span>    cd /tmp/befunge &amp;&amp; \\</span></span>
<span class="line"><span>    make &amp;&amp; \\</span></span>
<span class="line"><span>    cp bin/bef /usr/local/bin/befunge93 &amp;&amp; \\</span></span>
<span class="line"><span>    cd / &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /tmp/befunge &amp;&amp; \\</span></span>
<span class="line"><span>    apt-get remove -y git gcc make libc6-dev &amp;&amp; \\</span></span>
<span class="line"><span>    apt-get autoremove -y &amp;&amp; \\</span></span>
<span class="line"><span>    apt-get clean &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SHELL [&quot;/bin/bash&quot;, &quot;-c&quot;]</span></span></code></pre></div><h3 id="standalone-1" tabindex="-1">Standalone <a class="header-anchor" href="#standalone-1" aria-label="Permalink to &quot;Standalone&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FROM debian:12-slim AS builder</span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /build</span></span>
<span class="line"><span>RUN apt-get update &amp;&amp; \\</span></span>
<span class="line"><span>    apt-get install -y --no-install-recommends \\</span></span>
<span class="line"><span>        git \\</span></span>
<span class="line"><span>        gcc \\</span></span>
<span class="line"><span>        make \\</span></span>
<span class="line"><span>        libc6-dev \\</span></span>
<span class="line"><span>        ca-certificates &amp;&amp; \\</span></span>
<span class="line"><span>    git clone https://github.com/catseye/Befunge-93.git /tmp/befunge &amp;&amp; \\</span></span>
<span class="line"><span>    cd /tmp/befunge &amp;&amp; \\</span></span>
<span class="line"><span>    make &amp;&amp; \\</span></span>
<span class="line"><span>    cp bin/bef /usr/local/bin/befunge93 &amp;&amp; \\</span></span>
<span class="line"><span>    apt-get clean &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FROM debian:12-slim</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span>RUN apt-get update &amp;&amp; \\</span></span>
<span class="line"><span>    apt-get install -y --no-install-recommends \\</span></span>
<span class="line"><span>        bash \\</span></span>
<span class="line"><span>        curl &amp;&amp; \\</span></span>
<span class="line"><span>    apt-get clean &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /var/lib/apt/lists/*</span></span>
<span class="line"><span>COPY --from=builder /usr/local/bin/befunge93 /usr/local/bin/befunge93</span></span>
<span class="line"><span>COPY app/*.bf .</span></span>
<span class="line"><span>SHELL [&quot;/bin/bash&quot;, &quot;-c&quot;]</span></span>
<span class="line"><span>CMD [&quot;befunge93&quot;, &quot;main.bf&quot;]</span></span></code></pre></div><h4 id="purpose-1" tabindex="-1">Purpose <a class="header-anchor" href="#purpose-1" aria-label="Permalink to &quot;Purpose&quot;">​</a></h4><ul><li>Dockerfile.base: contains a small Befunge interpreter or runtime environment used as the shared layer for building/running Befunge programs.</li><li>Dockerfile.standalone: copies the sample <code>.bf</code> program into the image and sets the interpreter command as the container entrypoint to execute the program.</li></ul><p>How to build locally:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/befunge/Dockerfile.base</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-befunge-base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/befunge</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/befunge/Dockerfile.standalone</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-befunge-standalone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/befunge</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --rm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-befunge-standalone</span></span></code></pre></div><hr><h2 id="java" tabindex="-1">Java <a class="header-anchor" href="#java" aria-label="Permalink to &quot;Java&quot;">​</a></h2><h3 id="base-2" tabindex="-1">Base <a class="header-anchor" href="#base-2" aria-label="Permalink to &quot;Base&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FROM eclipse-temurin:21-jdk-alpine</span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RUN apk add --no-cache bash maven &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /var/cache/apk/* &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /root/.m2/repository</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SHELL [&quot;/bin/bash&quot;, &quot;-c&quot;]</span></span></code></pre></div><h3 id="standalone-2" tabindex="-1">Standalone <a class="header-anchor" href="#standalone-2" aria-label="Permalink to &quot;Standalone&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FROM eclipse-temurin:21-jdk-alpine AS builder</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span>RUN apk add --no-cache bash maven &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /var/cache/apk/*</span></span>
<span class="line"><span>COPY app/pom.xml ./</span></span>
<span class="line"><span>RUN mvn dependency:go-offline -B</span></span>
<span class="line"><span>COPY app ./</span></span>
<span class="line"><span>RUN mvn package -DskipTests &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /root/.m2/repository</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>FROM eclipse-temurin:21-jre-alpine</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span>RUN apk add --no-cache bash &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /var/cache/apk/*</span></span>
<span class="line"><span>COPY --from=builder /app/target/*.jar app.jar</span></span>
<span class="line"><span>SHELL [&quot;/bin/bash&quot;, &quot;-c&quot;]</span></span>
<span class="line"><span>CMD [&quot;java&quot;, &quot;-jar&quot;, &quot;app.jar&quot;]</span></span></code></pre></div><h4 id="purpose-2" tabindex="-1">Purpose: <a class="header-anchor" href="#purpose-2" aria-label="Permalink to &quot;Purpose:&quot;">​</a></h4><ul><li>Dockerfile.base: provides a JDK and build tools (usually Maven) used for compiling Java projects.</li><li>Dockerfile.standalone: typically a multi-stage Dockerfile that builds the app with Maven then copies the resulting JAR into a smaller runtime image.</li></ul><p>How to build locally:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/java/Dockerfile.base</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-java-base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/java</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/java/Dockerfile.standalone</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-java-standalone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/java</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --rm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-java-standalone</span></span></code></pre></div><p>Notes:</p><ul><li>The standalone Dockerfile often contains a build stage that requires a larger image (openjdk + maven) and a final slimmer runtime stage (openjdk:jre or eclipse-temurin:jre).</li><li>Ensure the Maven build produces an executable JAR, or update the entrypoint to the correct <code>java -jar /path/app.jar</code> command.</li></ul><hr><h2 id="javascript" tabindex="-1">JavaScript <a class="header-anchor" href="#javascript" aria-label="Permalink to &quot;JavaScript&quot;">​</a></h2><h3 id="base-3" tabindex="-1">Base <a class="header-anchor" href="#base-3" aria-label="Permalink to &quot;Base&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FROM node:20.9-alpine</span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span>RUN apk add --no-cache bash &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /var/cache/apk/*</span></span>
<span class="line"><span>SHELL [&quot;/bin/bash&quot;, &quot;-c&quot;]</span></span></code></pre></div><h3 id="standalone-3" tabindex="-1">Standalone <a class="header-anchor" href="#standalone-3" aria-label="Permalink to &quot;Standalone&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FROM node:20.9-alpine</span></span>
<span class="line"><span>WORKDIR /app</span></span>
<span class="line"><span>RUN apk add --no-cache bash &amp;&amp; \\</span></span>
<span class="line"><span>    rm -rf /var/cache/apk/*</span></span>
<span class="line"><span>COPY package*.json ./</span></span>
<span class="line"><span>RUN npm install --omit=dev &amp;&amp; \\</span></span>
<span class="line"><span>    npm cache clean --force</span></span>
<span class="line"><span>COPY . .</span></span>
<span class="line"><span>SHELL [&quot;/bin/bash&quot;, &quot;-c&quot;]</span></span>
<span class="line"><span>CMD [&quot;node&quot;, &quot;.&quot;]</span></span></code></pre></div><h4 id="purpose-3" tabindex="-1">Purpose : <a class="header-anchor" href="#purpose-3" aria-label="Permalink to &quot;Purpose :&quot;">​</a></h4><ul><li>Dockerfile.base: provides a Node.js runtime and common tooling (npm or yarn). Useful as a shared layer in CI to cache npm installs.</li><li>Dockerfile.standalone: installs <code>package.json</code> dependencies and copies the example <code>app.js</code> then sets <code>node app.js</code> as the entrypoint.</li></ul><p>How to build locally:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/javascript/Dockerfile.base</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-javascript-base</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/javascript</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/javascript/Dockerfile.standalone</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-javascript-standalone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> images/javascript</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --rm</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 3000:3000</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-javascript-standalone</span></span></code></pre></div><hr><h2 id="building-and-pushing-to-the-local-registry" tabindex="-1">Building and pushing to the local registry <a class="header-anchor" href="#building-and-pushing-to-the-local-registry" aria-label="Permalink to &quot;Building and pushing to the local registry&quot;">​</a></h2><p>If you are using the local registry deployed by the Whanos deployment (default <code>REGISTRY_URL</code> points to <code>MASTER_IP:5000</code>), tag and push images like this:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> tag</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> whanos-python-base</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${REGISTRY_URL}</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/whanos-python:base</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> push</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${REGISTRY_URL}</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/whanos-python:base</span></span></code></pre></div>`,54)])])}const u=s(i,[["render",l]]);export{k as __pageData,u as default};
