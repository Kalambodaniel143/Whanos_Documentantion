# Jenkins Job DSL Configuration

This document explains the Jenkins Job DSL configuration file (`jenkins/job_dsl.groovy`) that automatically creates and configures all Jenkins jobs for the Whanos infrastructure.

## 📋 Table of Contents

- [Overview](#overview)
- [Job DSL Architecture](#job-dsl-architecture)
- [Folder Structure](#folder-structure)
- [Base Image Build Jobs](#base-image-build-jobs)
- [Build All Base Images Job](#build-all-base-images-job)
- [Link Project Job](#link-project-job)
- [Language Detection Logic](#language-detection-logic)
- [Deployment Workflow](#deployment-workflow)
- [Environment Variables](#environment-variables)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

## Overview

**Location:** `jenkins/job_dsl.groovy`

**Purpose:** This Groovy script uses the [Jenkins Job DSL Plugin](https://plugins.jenkins.io/job-dsl/) to programmatically create and configure Jenkins jobs. Instead of manually clicking through the Jenkins UI to create jobs, this script defines all jobs as code.


**Our Jenkins instance What it creates:**
1. Two organizational folders: `Whanos base images` and `Projects`
2. Five individual base image build jobs (one per language that we support)
3. One aggregator job to build all base images at once
4. One `link-project` job that dynamically creates new project build jobs

## Job DSL Architecture

```
Jenkins Jobs
│
├── Whanos base images/          [Folder]
│   ├── whanos-befunge           [Job] Build Befunge base image
│   ├── whanos-c                 [Job] Build C base image
│   ├── whanos-java              [Job] Build Java base image
│   ├── whanos-javascript        [Job] Build JavaScript base image
│   ├── whanos-python            [Job] Build Python base image
│   └── Build all base images    [Job] Trigger all above jobs
│
├── Projects/                     [Folder]
│   ├── <project-1>              [Job] Auto-created by link-project
│   ├── <project-2>              [Job] Auto-created by link-project
│   └── ...
│
└── link-project                  [Job] Creates new project jobs
```

## Folder Structure

### Whanos base images Folder

**Purpose:** Organizes all base image build jobs in one location.

**Contains:** Individual language base image jobs and the "Build all" aggregator job.

### Projects Folder

**Purpose:** Organizes all user project build/deploy jobs.

**Contains:** Dynamically created jobs (one per linked Git repository).

## Base Image Build Jobs

**Definition:**

```groovy
def languages = ['befunge', 'c', 'java', 'javascript', 'python']

languages.each { lang ->
    freeStyleJob("Whanos base images/whanos-${lang}") {
        displayName("whanos-${lang}")
        description("Build de l'image de base whanos-${lang}")
        
        logRotator {
            numToKeep(10)  // Keep last 10 builds
        }
        
        wrappers {
            timestamps()  // Add timestamps to console output
        }
        
        steps {
            shell("""
                # Build script here
            """)
        }
    }
}
```

**What each job does:**

1. **Reads environment variables:**
   - `REGISTRY_URL` - Local registry address (default: `localhost:5000`)
   - `DOCKER_HUB_USERNAME` - Docker Hub username (optional)
   - `DOCKER_HUB_TOKEN` - Docker Hub access token (optional)

2. **Builds the base image:**
   ```bash
   cd /var/jenkins_home/whanos_images/${lang}
   docker build -t $REGISTRY_URL/whanos-${lang}:latest -f Dockerfile.base .
   ```

3. **Pushes to local registry:**
   ```bash
   docker push $REGISTRY_URL/whanos-${lang}:latest
   ```

4. **Optionally pushes to Docker Hub:**
   ```bash
   if [ -n "$DOCKER_HUB_USERNAME" ] && [ -n "$DOCKER_HUB_TOKEN" ]; then
       echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin
       docker tag $REGISTRY_URL/whanos-${lang}:latest $DOCKER_HUB_USERNAME/whanos-${lang}:latest
       docker push $DOCKER_HUB_USERNAME/whanos-${lang}:latest
       docker logout
   fi
   ```

**Generated jobs:**
- `Whanos base images/whanos-befunge`
- `Whanos base images/whanos-c`
- `Whanos base images/whanos-java`
- `Whanos base images/whanos-javascript`
- `Whanos base images/whanos-python`

## Build All Base Images Job

**Definition:**

```groovy
freeStyleJob('Whanos base images/Build all base images') {
    displayName('Build all base images')
    description('Déclenche le build de toutes les images de base')
    
    logRotator {
        numToKeep(10)
    }
    
    wrappers {
        timestamps()
    }
    
    publishers {
        downstream('Whanos base images/whanos-befunge, Whanos base images/whanos-c, Whanos base images/whanos-java, Whanos base images/whanos-javascript, Whanos base images/whanos-python', 'SUCCESS')
    }
}
```

**Purpose:** Convenience job to trigger all five base image builds in parallel.

**How it works:**
- Uses the `downstream` publisher to trigger child jobs
- Waits for successful completion (doesn't fail if one child fails)
- Triggers jobs: befunge, c, java, javascript, python

**When to use:**
- After initial Whanos deployment
- After modifying any `Dockerfile.base` files
- To refresh all base images

## Link Project Job

**Definition:**

```groovy
freeStyleJob('link-project') {
    displayName('link-project')
    description('Crée un nouveau job de build pour un projet depuis un repository Git')
    
    parameters {
        stringParam('DISPLAY_NAME', '', 'Nom d affichage du projet')
        stringParam('GIT_REPOSITORY', '', 'URL du repository Git')
    }
    
    steps {
        dsl {
            text('''
                // Dynamic job creation script
            ''')
        }
    }
}
```

**Purpose:** Dynamically creates a new Jenkins job for a user's Git repository.

**Parameters:**
- `DISPLAY_NAME` - Human-readable project name (e.g., "My Python API")
- `GIT_REPOSITORY` - Git repository URL (e.g., `https://github.com/user/repo.git`)

**What it does:**

1. **Validates inputs:**
   ```groovy
   if (!projectDisplayName || !gitRepo) {
       throw new Exception("DISPLAY_NAME et GIT_REPOSITORY sont requis!")
   }
   ```

2. **Generates job name:**
   ```groovy
   def jobName = projectDisplayName.replaceAll(/[^a-zA-Z0-9-_]/, '-').toLowerCase()
   ```
   - Converts spaces to hyphens
   - Removes special characters
   - Example: "My Python API" → `my-python-api`

3. **Creates the project job:**
   ```groovy
   freeStyleJob("Projects/${jobName}") {
       displayName(projectDisplayName)
       scm {
           git {
               remote {
                   url(gitRepo)
                   credentials('github-credentials')
               }
               branch('*/main')
           }
       }
       triggers {
           scm('* * * * *')  // Poll SCM every minute
       }
       steps {
           shell('''
               # Build and deploy script
           ''')
       }
   }
   ```

## Language Detection Logic

The dynamically created project jobs include smart language detection:

### Detection Criteria

| Language   | Detection File/Pattern              | Priority |
|------------|-------------------------------------|----------|
| C          | `Makefile` containing `gcc`         | 1        |
| Java       | `app/pom.xml`                       | 1        |
| JavaScript | `package.json` (root)               | 1        |
| Python     | `requirements.txt` (root)           | 1        |
| Befunge    | `app/main.bf`                       | 1        |

### Detection Rules

**Rule 1: Exactly one criterion must match**

```bash
DETECTION_COUNT=0

# Check each language
[ -f "Makefile" ] && grep -q "gcc" Makefile && DETECTION_COUNT=$((DETECTION_COUNT + 1))
[ -f "app/pom.xml" ] && DETECTION_COUNT=$((DETECTION_COUNT + 1))
[ -f "package.json" ] && DETECTION_COUNT=$((DETECTION_COUNT + 1))
[ -f "requirements.txt" ] && DETECTION_COUNT=$((DETECTION_COUNT + 1))
[ -f "app/main.bf" ] && DETECTION_COUNT=$((DETECTION_COUNT + 1))

if [ $DETECTION_COUNT -eq 0 ]; then
    echo "❌ No Whanos-compatible language detected"
    exit 1
elif [ $DETECTION_COUNT -gt 1 ]; then
    echo "❌ Multiple languages detected (ambiguous)"
    exit 1
fi
```

**Rule 2: Unambiguous detection**

A repository must match **exactly one** language criterion. If multiple files are present (e.g., both `package.json` and `requirements.txt`), the build fails with an error.

### Valid Repository Examples

**Python project:**
```
my-python-api/
├── requirements.txt          ✓ Python detected
├── app/
│   ├── __init__.py
│   └── __main__.py
```

**JavaScript project:**
```
my-js-app/
├── package.json              ✓ JavaScript detected
├── app/
│   └── app.js
```

**Java project:**
```
my-java-service/
├── app/
│   └── pom.xml               ✓ Java detected
│   └── src/
```

### Invalid Repository (Ambiguous)

```
mixed-project/
├── package.json              ✗ JavaScript detected
├── requirements.txt          ✗ Python detected (conflict!)
```

**Error:**
```
❌ ERREUR: Plusieurs critères de détection satisfaits (2)
Un repository Whanos-compatible ne peut correspondre qu'à UN SEUL langage
```

## Deployment Workflow

Once language is detected, the project job performs these steps:

### Step 1: Pull Base Image

```bash
docker pull ${REGISTRY_URL}/whanos-${LANGUAGE}:latest
docker tag ${REGISTRY_URL}/whanos-${LANGUAGE}:latest whanos-${LANGUAGE}:latest
```

### Step 2: Choose Dockerfile

```bash
if [ -f "Dockerfile" ]; then
    DOCKERFILE_PATH="Dockerfile"  # Custom Dockerfile
else
    DOCKERFILE_PATH="/var/jenkins_home/whanos_images/${LANGUAGE}/Dockerfile.standalone"
fi
```

**Priority:**
1. Project's own `Dockerfile` (if present)
2. Language's `Dockerfile.standalone` (fallback)

### Step 3: Build Application Image

```bash
PROJECT_NAME="<job-name>"
IMAGE_TAG="${REGISTRY_URL}/${PROJECT_NAME}:${BUILD_NUMBER}"
IMAGE_LATEST="${REGISTRY_URL}/${PROJECT_NAME}:latest"

docker build -t ${IMAGE_TAG} -t ${IMAGE_LATEST} \
    --build-arg BASE_IMAGE=${REGISTRY_URL}/whanos-${LANGUAGE}:latest \
    -f ${DOCKERFILE_PATH} .
```

**Tags created:**
- `${REGISTRY_URL}/${PROJECT_NAME}:${BUILD_NUMBER}` - Specific build number
- `${REGISTRY_URL}/${PROJECT_NAME}:latest` - Latest version

### Step 4: Push to Registries

**Local Registry (always):**
```bash
docker push ${IMAGE_TAG}
docker push ${IMAGE_LATEST}
```

**Docker Hub (optional):**
```bash
if [ -n "${DOCKER_HUB_USERNAME}" ] && [ -n "${DOCKER_HUB_TOKEN}" ]; then
    echo "${DOCKER_HUB_TOKEN}" | docker login -u "${DOCKER_HUB_USERNAME}" --password-stdin
    
    docker tag ${IMAGE_TAG} ${DOCKER_HUB_USERNAME}/${PROJECT_NAME}:${BUILD_NUMBER}
    docker tag ${IMAGE_LATEST} ${DOCKER_HUB_USERNAME}/${PROJECT_NAME}:latest
    
    docker push ${DOCKER_HUB_USERNAME}/${PROJECT_NAME}:${BUILD_NUMBER}
    docker push ${DOCKER_HUB_USERNAME}/${PROJECT_NAME}:latest
    
    docker logout
fi
```

### Step 5: Kubernetes Deployment (Optional) if we hace a valid whanos file

**Detection:**
```bash
if [ -f "whanos.yml" ] || [ -f "whanos.yaml" ]; then
    # Deploy to Kubernetes
fi
```

**Deployment with Helm:**
```bash
helm upgrade --install ${PROJECT_NAME} /var/jenkins_home/helm/Whanos \
    --set image.repository=${REGISTRY_URL}/${PROJECT_NAME} \
    --set image.tag=${BUILD_NUMBER} \
    --set nameOverride=${PROJECT_NAME} \
    --values whanos.yml \
    --namespace default \
    --create-namespace
```

**Requirements:**
- Kubernetes cluster accessible (`kubectl cluster-info` succeeds)
- `whanos.yml` or `whanos.yaml` file in repository root
- Valid Helm values in the whanos config file

**Skip deployment if:**
- No `whanos.yml`/`whanos.yaml` file (image build only)
- Kubernetes cluster not accessible (graceful skip with warning)

## Environment Variables

These environment variables are injected into the Jenkins container and used by all jobs:

| Variable              | Required | Purpose                          | Example                        |
|-----------------------|----------|----------------------------------|--------------------------------|
| `REGISTRY_URL`        | Yes      | Local Docker registry address    | `192.168.1.10:5000`           |
| `DOCKER_HUB_USERNAME` | No       | Docker Hub username for push     | `myusername`                  |
| `DOCKER_HUB_TOKEN`    | No       | Docker Hub access token          | `dckr_pat_xxxxx`              |
| `GITHUB_USERNAME`     | Yes      | GitHub username for private repos| `johndoe`                     |
| `GITHUB_TOKEN`        | Yes      | GitHub personal access token     | `ghp_xxxxx`                   |

**Configuration:**

These are set in the `.env` file and injected during Jenkins container startup:

```bash
# In .env
REGISTRY_URL=192.168.1.10:5000
DOCKER_HUB_USERNAME=myuser
DOCKER_HUB_TOKEN=dckr_pat_xxxxx

# Injected into Jenkins container
docker run -d \
    -e REGISTRY_URL="$REGISTRY_URL" \
    -e DOCKER_HUB_USERNAME="$DOCKER_HUB_USERNAME" \
    -e DOCKER_HUB_TOKEN="$DOCKER_HUB_TOKEN" \
    ...
    whanos-jenkins
```

## Usage Examples

### Example 1: Build All Base Images

**When:** After initial deployment or after updating base Dockerfiles

**Steps:**
1. Open Jenkins: `http://MASTER_IP:8080`
2. Navigate to: `Whanos base images/`
3. Click: `Build all base images`
4. Click: `Build Now`

**Result:** All five base images built and pushed to registries.

**Verification:**
```bash
curl http://MASTER_IP:5000/v2/_catalog

# Expected output:
# {"repositories":["whanos-befunge","whanos-c","whanos-java","whanos-javascript","whanos-python"]}
```

### Example 2: Link a New Python Project

**Repository structure:**
```
my-api/
├── requirements.txt
├── app/
│   ├── __init__.py
│   └── __main__.py
└── whanos.yml
```

**Steps:**
1. Open Jenkins
2. Click: `link-project`
3. Click: `Build with Parameters`
4. Fill in:
   - **DISPLAY_NAME:** `My Python API`
   - **GIT_REPOSITORY:** `https://github.com/user/my-api.git`
5. Click: `Build`

**What happens:**
1. New job created: `Projects/my-python-api`
2. Job polls Git every minute
3. On code change:
   - Detects Python (requirements.txt)
   - Builds image: `REGISTRY_URL/my-python-api:1`
   - Pushes to registries
   - Deploys to Kubernetes (if whanos.yml present)

### Example 3: Link a JavaScript Project with Custom Dockerfile

**Repository structure:**
```
my-node-app/
├── package.json
├── Dockerfile                    # Custom Dockerfile
├── app/
│   └── app.js
└── whanos.yml
```

**Dockerfile:**
```dockerfile
FROM whanos-javascript

COPY package.json package-lock.json ./
RUN npm ci --production

COPY app ./app

CMD ["node", "app/app.js"]
```

**Steps:**
1. Link project via `link-project` job
2. Jenkins detects `Dockerfile` in repo
3. Uses custom `Dockerfile` instead of `Dockerfile.standalone`
4. Builds with: `--build-arg BASE_IMAGE=${REGISTRY_URL}/whanos-javascript:latest`

**Result:** Custom build logic with base image as starting point.

### Example 4: Image-Only Build (No Kubernetes)

**Repository without whanos.yml:**
```
simple-app/
├── requirements.txt
└── app/
    └── __main__.py
# No whanos.yml
```

**Behavior:**
1. Builds Docker image
2. Pushes to registries
3. Skips Kubernetes deployment
4. Console output:
   ```
   ℹ️  Pas de whanos.yml/whanos.yaml, skip déploiement Kubernetes
   ```

**Use case:** Build and push images for manual deployment elsewhere.

## Troubleshooting

### Issue: "No Whanos-compatible language detected"

**Cause:** Repository doesn't match any detection criteria.

**Solution:**

Check your repository has one of:
- `Makefile` with `gcc` (for C)
- `app/pom.xml` (for Java)
- `package.json` in root (for JavaScript)
- `requirements.txt` in root (for Python)
- `app/main.bf` (for Befunge)

**Example fix for Python:**
```bash
# Add requirements.txt
cd your-repo
echo "flask==2.3.0" > requirements.txt
git add requirements.txt
git commit -m "Add requirements.txt for Whanos"
git push
```

### Issue: "Multiple languages detected"

**Cause:** Repository has files for multiple languages.

**Example:**
```
mixed-repo/
├── package.json          # JavaScript
├── requirements.txt      # Python (conflict!)
```

**Solution:** Remove one of the detection files or split into separate repos.

```bash
# Keep Python, remove JavaScript
rm package.json
git commit -am "Remove package.json - Python project only"
git push
```

### Issue: "Registry connection refused"

**Cause:** `REGISTRY_URL` not set or registry not running.

**Solution:**

```bash
# Check registry is running
ssh root@MASTER_IP "docker ps | grep registry"

# Test registry
curl http://MASTER_IP:5000/v2/_catalog

# If not running, redeploy
./deploy.sh
```

### Issue: "Docker Hub push fails"

**Cause:** Invalid `DOCKER_HUB_TOKEN` or `DOCKER_HUB_USERNAME`.

**Solution:**

1. **Generate new token:**
   - Visit: https://hub.docker.com/settings/security
   - Click: "New Access Token"
   - Permissions: Read, Write, Delete
   - Copy token

2. **Update `.env`:**
   ```bash
   DOCKER_HUB_USERNAME=your_username
   DOCKER_HUB_TOKEN=dckr_pat_your_new_token
   ```

3. **Restart Jenkins:**
   ```bash
   ssh root@MASTER_IP "docker restart whanos-jenkins"
   ```

### Issue: "Kubernetes deployment skipped"

**Cause:** No `whanos.yml` or K8s cluster not accessible.

**Solution 1: Add whanos.yml**

```yaml
# whanos.yml
deployment:
  replicas: 2
  resources:
    limits:
      memory: "512Mi"
      cpu: "500m"

service:
  type: NodePort
  port: 8080
```

**Solution 2: Check K8s access**

```bash
ssh root@MASTER_IP

# Test kubectl
kubectl cluster-info

# Check nodes
kubectl get nodes

# If broken, reinstall K3s
./deploy.sh
```

### Issue: "Job DSL script failed"

**Cause:** Syntax error in dynamically generated job.

**Solution:**

1. Check Jenkins logs:
   ```bash
   ssh root@MASTER_IP "docker logs whanos-jenkins | tail -100"
   ```

2. Verify Job DSL syntax:
   - Jenkins → Manage Jenkins → Script Console
   - Test syntax with: `println("test")`

3. Re-run seed job:
   - Jenkins → Seed Job → Build Now

### Issue: "GitHub authentication failed"

**Cause:** Invalid `GITHUB_TOKEN` or expired token.

**Solution:**

1. **Generate new token:**
   - Visit: https://github.com/settings/tokens
   - Generate new token (classic)
   - Scopes: `repo`, `read:packages`
   - Copy token

2. **Update Jenkins credentials:**
   - Jenkins → Manage Jenkins → Credentials
   - Update `github-credentials`
   - Or restart Jenkins with new token in `.env`


## Advanced Topics

### Customizing the Job DSL

To add support for a new language:

1. **Add to language list:**
   ```groovy
   def languages = ['befunge', 'c', 'java', 'javascript', 'python', 'ruby']
   ```

2. **Create base Dockerfile:**
   ```bash
   mkdir -p images/ruby
   # Create images/ruby/Dockerfile.base
   # Create images/ruby/Dockerfile.standalone
   ```

3. **Update detection logic in link-project:**
   ```groovy
   # Add Ruby detection (Gemfile)
   if [ -f "Gemfile" ]; then
       DETECTION_COUNT=$((DETECTION_COUNT + 1))
       LANGUAGE="ruby"
       echo "✓ Critère Ruby détecté (Gemfile)"
   fi
   ```

4. **Reload Jenkins configuration:**
   ```bash
   ssh root@MASTER_IP "docker restart whanos-jenkins"
   ```

### SCM Polling Frequency

Default: every minute (`* * * * *`)

To change:
```groovy
triggers {
    scm('H/5 * * * *')  // Every 5 minutes
}
```

### Build Retention

Default: keep last 10 builds

To change:
```groovy
logRotator {
    numToKeep(20)       // Keep 20 builds
    daysToKeep(30)      // Or keep 30 days
}
```

---
