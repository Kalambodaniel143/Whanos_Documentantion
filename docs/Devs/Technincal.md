# Whanos - Documentation for Dev

## Overview of the projet

**Whanos** is an automated DevOps infrastructure that enables any developer to deploy an application into a Kubernetes cluster simply by pushing their code to a Git repository.  
It integrates several key technologies — **Docker**, **Jenkins**, **Ansible**, and **Kubernetes** — to achieve full CI/CD automation.


## Architecture Overview

Whanos is built upon four main components, each representing a major DevOps principle:

| Technology | Role | Description |
|-------------|------|-------------|
| **Docker** | Containerization | Builds standardized images for applications in different languages. |
| **Jenkins** | CI/CD Automation | Detects repository updates, triggers builds, and automates deployment pipelines. |
| **Ansible** | Configuration Management | Deploys and maintains the Whanos infrastructure on remote servers. |
| **Kubernetes** | Orchestration | Manages application deployments, scaling, and networking within the cluster. |


<!-- ## Docker Integration

Whanos relies heavily on **Docker** to containerize supported applications.  
Each language (C, Java, JavaScript, Python, Befunge) has two image types:

- **Base images** → reusable layers developers can extend.  
- **Standalone images** → ready-to-run environments for direct application execution.

### Responsibilities
- Detect the language based on repository structure.
- Build a container image with the proper runtime.
- Remove unnecessary files (e.g. source code after compilation).
- Push images to a Docker registry for deployment.

### Integration Example
When Jenkins detects a C application with a `Makefile`, it builds the image using the `whanos-c` base image and runs:
```bash
make && ./compiled-app
```

## Jenkins Integration

**Jenkins** is the automation core of Whanos.
It continuously monitors Whanos-compatible repositories, builds Docker images, and deploys them.

### Responsibilities

* Clone repositories.
* Trigger Docker builds based on repository content.
* Execute deployment steps if a valid `whanos.yml` is present.
* Manage build jobs and base image creation.

### Jenkins Job Structure

* **Whanos base images folder** → contains jobs to build base images for each language.
* **Projects folder** → contains jobs created by the `link-project` pipeline to build and deploy applications.
* **Build all base images** → triggers all base image builds simultaneously.

---

## Ansible Integration

**Ansible** is used to automate the deployment of the entire Whanos infrastructure — including Jenkins setup, Docker installation, and Kubernetes cluster configuration.

### Responsibilities

* Ensure reproducible and idempotent deployments.
* Automate the installation of all required services.
* Manage environment configuration using variables and playbooks.

### Integration Example

Deploying the Jenkins instance or Kubernetes cluster can be done through:

```bash
ansible-playbook -i inventory.ini deploy.yml
```

---

## Kubernetes Integration

**Kubernetes** orchestrates containerized applications automatically once built and pushed by Jenkins.

### Responsibilities

* Deploy images based on `whanos.yml` configuration.
* Manage replicas, resources, and exposed ports.
* Ensure availability and scalability across cluster nodes.

### Example `whanos.yml`

```yaml
deployment:
  replicas: 2
  resources:
    limits:
      cpu: "500m"
      memory: "256Mi"
  ports:
    - 8080
```

If defined, Whanos ensures the container is deployed to the cluster and accessible externally.

---

## Additional Tools & Best Practices

* **GitHub Actions** or **Jenkinsfile** can extend automation.
* **Private registries** can be integrated for secure image storage.
* **Security & secrets management** should be handled outside the repo.

---

## Summary

Whanos integrates four major DevOps “Infinity Stones”:

1. **Docker** – Build and package.
2. **Jenkins** – Automate CI/CD pipelines.
3. **Ansible** – Configure and deploy infrastructure.
4. **Kubernetes** – Orchestrate and scale deployments.

Together, they create a seamless, automated DevOps pipeline capable of handling diverse application stacks. -->