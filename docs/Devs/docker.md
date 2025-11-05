# Befunge-93 - Whanos Base Image

## 🐳 Dockerfile.base

### Description

The Goal of this file `Dockerfile.base` is to creat a lightweight Debian 12 image containing a ready-to-use Befunge-93 interpreter.

### Detailed Breakdown

```dockerfile
FROM debian:12-slim
```
- **Base image**: Debian 12 Slim (minimal Debian version, optimized for containers)
- **Advantage**: Low memory and disk footprint

---

```dockerfile
WORKDIR /app
```
- **Working directory**: `/app`
- All subsequent files and commands will execute in this directory

---

```dockerfile
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        bash \
        curl \
        git \
        gcc \
        make \
        libc6-dev \
        ca-certificates && \
```
- **Installing build dependencies**:
  - `bash`: the Shell that must be used for running command
  - `git`: Clone the Befunge-93 source repository
  - `gcc`, `make`, `libc6-dev`: C compiler and build tools (Befunge-93 is written in C)
  - `ca-certificates`: SSL certificates for `git clone` via HTTPS

---

```dockerfile
    git clone https://github.com/catseye/Befunge-93.git /tmp/befunge && \
    cd /tmp/befunge && \
    make && \
    cp bin/bef /usr/local/bin/befunge93 && \
```
- **Compiling the Befunge-93 interpreter**:
  1. Clone the official [catseye/Befunge-93](https://github.com/catseye/Befunge-93) repository to `/tmp/befunge`
  2. Run compilation with `make`
  3. Copy the compiled executable `bin/bef` to `/usr/local/bin/befunge93` (globally available)

---

```dockerfile
    cd / && \
    rm -rf /tmp/befunge && \
```
- **Source cleanup**: Remove the temporary `/tmp/befunge` directory to reduce image size

---

```dockerfile
    apt-get remove -y git gcc make libc6-dev && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```
- **Build dependencies cleanup**:
  - Remove compilation tools (no longer needed after build)
  - Clean APT cache
  - **Result**: Much lighter final image (only the `befunge93` executable remains)

---

```dockerfile
SHELL ["/bin/bash", "-c"]
```
- **Default shell**: Bash
- Used for `RUN` commands and interactive sessions

---

## Example of Usage
### Building the Base Image

```bash
docker build -t whanos/befunge:base -f images/befunge/Dockerfile.base images/befunge
```
### Manual Image Testing
```bash
# Launch an interactive container
docker run -it --rm whanos/befunge:base bash
befunge93 --help
```

### Running a Befunge Program

```bash
# Create a hello.bf file
echo '52*"!dlroW ,olleH">:#,_@' > hello.bf

# Execute with the interpreter
docker run -it --rm -v $(pwd):/app whanos/befunge:base befunge93 hello.bf
```

**Expected output**:
```
Hello, World!
```
