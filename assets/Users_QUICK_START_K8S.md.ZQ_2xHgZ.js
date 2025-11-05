import{_ as n,c as a,o as i,ae as e}from"./chunks/framework.CyJo7YO6.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Users/QUICK_START_K8S.md","filePath":"Users/QUICK_START_K8S.md"}'),t={name:"Users/QUICK_START_K8S.md"};function l(p,s,o,h,r,d){return i(),a("div",null,[...s[0]||(s[0]=[e(`<ol><li><strong>Documentation technique</strong> → pour les développeurs (chaque technologie, son rôle, et son intégration).</li><li><strong>Documentation utilisateur (overview)</strong> → pour présenter le projet, ses objectifs et sa valeur.</li></ol><p>Je vais te générer un <strong>modèle en anglais</strong>, directement <strong>au format Markdown (<code>.md</code>)</strong>, prêt à être intégré dans ton site VitePress. Tu pourras créer deux fichiers distincts, par exemple :</p><ul><li><code>docs/technical_documentation.md</code></li><li><code>docs/user_documentation.md</code></li></ul><hr><h2 id="🧩-technical-documentation-md" tabindex="-1">🧩 <code>technical_documentation.md</code> <a class="header-anchor" href="#🧩-technical-documentation-md" aria-label="Permalink to &quot;🧩 \`technical_documentation.md\`&quot;">​</a></h2><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;"># Whanos - Technical Documentation</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## Overview</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Whanos**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> is an automated DevOps infrastructure that enables any developer to deploy an application into a Kubernetes cluster simply by pushing their code to a Git repository.  </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">It integrates several key technologies — </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Docker**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Jenkins**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Ansible**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, and </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Kubernetes**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> — to achieve full CI/CD automation.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## 🧱 Architecture Overview</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Whanos is built upon four main components, each representing a major DevOps principle:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| Technology | Role | Description |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">|-------------|------|-------------|</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Docker**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | Containerization | Builds standardized images for applications in different languages. |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Jenkins**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | CI/CD Automation | Detects repository updates, triggers builds, and automates deployment pipelines. |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Ansible**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | Configuration Management | Deploys and maintains the Whanos infrastructure on remote servers. |</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">| </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Kubernetes**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | Orchestration | Manages application deployments, scaling, and networking within the cluster. |</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">---</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## ⚙️ Docker Integration</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Whanos relies heavily on </span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;">**Docker**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> to containerize supported applications.  </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Each language (C, Java, JavaScript, Python, Befunge) has two image types:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **Base images**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> → reusable layers developers can extend.  </span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold;"> **Standalone images**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> → ready-to-run environments for direct application execution.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### Responsibilities</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Detect the language based on repository structure.</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Build a container image with the proper runtime.</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Remove unnecessary files (e.g. source code after compilation).</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Push images to a Docker registry for deployment.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">### Integration Example</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">When Jenkins detects a C application with a </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`Makefile\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, it builds the image using the </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`whanos-c\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> base image and runs:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`\`\`bash</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">make</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp;&amp; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./compiled-app</span></span></code></pre></div><hr><h2 id="🤖-jenkins-integration" tabindex="-1">🤖 Jenkins Integration <a class="header-anchor" href="#🤖-jenkins-integration" aria-label="Permalink to &quot;🤖 Jenkins Integration&quot;">​</a></h2><p><strong>Jenkins</strong> is the automation core of Whanos. It continuously monitors Whanos-compatible repositories, builds Docker images, and deploys them.</p><h3 id="responsibilities" tabindex="-1">Responsibilities <a class="header-anchor" href="#responsibilities" aria-label="Permalink to &quot;Responsibilities&quot;">​</a></h3><ul><li>Clone repositories.</li><li>Trigger Docker builds based on repository content.</li><li>Execute deployment steps if a valid <code>whanos.yml</code> is present.</li><li>Manage build jobs and base image creation.</li></ul><h3 id="jenkins-job-structure" tabindex="-1">Jenkins Job Structure <a class="header-anchor" href="#jenkins-job-structure" aria-label="Permalink to &quot;Jenkins Job Structure&quot;">​</a></h3><ul><li><strong>Whanos base images folder</strong> → contains jobs to build base images for each language.</li><li><strong>Projects folder</strong> → contains jobs created by the <code>link-project</code> pipeline to build and deploy applications.</li><li><strong>Build all base images</strong> → triggers all base image builds simultaneously.</li></ul><hr><h2 id="🧩-ansible-integration" tabindex="-1">🧩 Ansible Integration <a class="header-anchor" href="#🧩-ansible-integration" aria-label="Permalink to &quot;🧩 Ansible Integration&quot;">​</a></h2><p><strong>Ansible</strong> is used to automate the deployment of the entire Whanos infrastructure — including Jenkins setup, Docker installation, and Kubernetes cluster configuration.</p><h3 id="responsibilities-1" tabindex="-1">Responsibilities <a class="header-anchor" href="#responsibilities-1" aria-label="Permalink to &quot;Responsibilities&quot;">​</a></h3><ul><li>Ensure reproducible and idempotent deployments.</li><li>Automate the installation of all required services.</li><li>Manage environment configuration using variables and playbooks.</li></ul><h3 id="integration-example" tabindex="-1">Integration Example <a class="header-anchor" href="#integration-example" aria-label="Permalink to &quot;Integration Example&quot;">​</a></h3><p>Deploying the Jenkins instance or Kubernetes cluster can be done through:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ansible-playbook</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -i</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> inventory.ini</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> deploy.yml</span></span></code></pre></div><hr><h2 id="☸️-kubernetes-integration" tabindex="-1">☸️ Kubernetes Integration <a class="header-anchor" href="#☸️-kubernetes-integration" aria-label="Permalink to &quot;☸️ Kubernetes Integration&quot;">​</a></h2><p><strong>Kubernetes</strong> orchestrates containerized applications automatically once built and pushed by Jenkins.</p><h3 id="responsibilities-2" tabindex="-1">Responsibilities <a class="header-anchor" href="#responsibilities-2" aria-label="Permalink to &quot;Responsibilities&quot;">​</a></h3><ul><li>Deploy images based on <code>whanos.yml</code> configuration.</li><li>Manage replicas, resources, and exposed ports.</li><li>Ensure availability and scalability across cluster nodes.</li></ul><h3 id="example-whanos-yml" tabindex="-1">Example <code>whanos.yml</code> <a class="header-anchor" href="#example-whanos-yml" aria-label="Permalink to &quot;Example \`whanos.yml\`&quot;">​</a></h3><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">deployment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  replicas</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  resources</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    limits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      cpu</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;500m&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      memory</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;256Mi&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    - </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8080</span></span></code></pre></div><p>If defined, Whanos ensures the container is deployed to the cluster and accessible externally.</p><hr><h2 id="🧠-additional-tools-best-practices" tabindex="-1">🧠 Additional Tools &amp; Best Practices <a class="header-anchor" href="#🧠-additional-tools-best-practices" aria-label="Permalink to &quot;🧠 Additional Tools &amp; Best Practices&quot;">​</a></h2><ul><li><strong>GitHub Actions</strong> or <strong>Jenkinsfile</strong> can extend automation.</li><li><strong>Private registries</strong> can be integrated for secure image storage.</li><li><strong>Security &amp; secrets management</strong> should be handled outside the repo.</li></ul><hr><h2 id="🧾-summary" tabindex="-1">🧾 Summary <a class="header-anchor" href="#🧾-summary" aria-label="Permalink to &quot;🧾 Summary&quot;">​</a></h2><p>Whanos integrates four major DevOps “Infinity Stones”:</p><ol><li><strong>Docker</strong> – Build and package.</li><li><strong>Jenkins</strong> – Automate CI/CD pipelines.</li><li><strong>Ansible</strong> – Configure and deploy infrastructure.</li><li><strong>Kubernetes</strong> – Orchestrate and scale deployments.</li></ol><p>Together, they create a seamless, automated DevOps pipeline capable of handling diverse application stacks.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🌍 \`user_documentation.md\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span># Whanos - User Documentation</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Overview</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Whanos** is a fully automated DevOps platform designed to simplify application deployment.  </span></span>
<span class="line"><span>By connecting your Git repository, Whanos automatically builds, containerizes, and deploys your application into a Kubernetes cluster.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## ✨ Key Features</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 🚀 **Automatic Deployment** — Push your code, and Whanos handles the rest.</span></span>
<span class="line"><span>- 🐳 **Multi-language Support** — Supports C, Java, JavaScript, Python, and even Befunge.</span></span>
<span class="line"><span>- ⚙️ **Smart Infrastructure** — Combines Docker, Jenkins, Ansible, and Kubernetes.</span></span>
<span class="line"><span>- ☁️ **Cloud-Ready** — Fully deployable on any cloud or on-premises environment.</span></span>
<span class="line"><span>- 🔁 **Continuous Delivery** — Automatic redeployment when your code changes.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🧭 How It Works</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. **Push your code** to a Whanos-compatible repository.</span></span>
<span class="line"><span>2. **Jenkins** detects the update and analyzes your project.</span></span>
<span class="line"><span>3. **Docker** builds a language-specific image.</span></span>
<span class="line"><span>4. **Ansible** ensures the infrastructure is up and configured.</span></span>
<span class="line"><span>5. **Kubernetes** deploys and runs your app.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 💻 Supported Languages</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| Language | Build Detection | Execution |</span></span>
<span class="line"><span>|-----------|----------------|------------|</span></span>
<span class="line"><span>| **C** | Makefile | \`./compiled-app\` |</span></span>
<span class="line"><span>| **Java** | pom.xml (Maven) | \`java -jar app.jar\` |</span></span>
<span class="line"><span>| **JavaScript** | package.json | \`node .\` |</span></span>
<span class="line"><span>| **Python** | requirements.txt | \`python -m app\` |</span></span>
<span class="line"><span>| **Befunge** | main.bf | custom execution |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🧱 System Overview</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Whanos automates the entire DevOps lifecycle:</span></span></code></pre></div><p>Git Push → Jenkins Build → Docker Image → Ansible Deploy → Kubernetes Run</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 📦 Example Workflow</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. Developer pushes to GitHub.</span></span>
<span class="line"><span>2. Jenkins fetches the repository.</span></span>
<span class="line"><span>3. Docker builds an image (\`whanos-python\` for Python).</span></span>
<span class="line"><span>4. The image is pushed to the registry.</span></span>
<span class="line"><span>5. Kubernetes deploys it automatically if \`whanos.yml\` exists.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🌐 Deployment Example</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`yaml</span></span>
<span class="line"><span>deployment:</span></span>
<span class="line"><span>  replicas: 3</span></span>
<span class="line"><span>  ports:</span></span>
<span class="line"><span>    - 80</span></span>
<span class="line"><span>    - 443</span></span></code></pre></div><p>The above file tells Whanos to deploy 3 instances of your app and expose ports 80 and 443 to the outside world.</p><hr><h2 id="🏁-conclusion" tabindex="-1">🏁 Conclusion <a class="header-anchor" href="#🏁-conclusion" aria-label="Permalink to &quot;🏁 Conclusion&quot;">​</a></h2><p>Whanos brings together the power of <strong>automation</strong>, <strong>consistency</strong>, and <strong>scalability</strong>. Whether you are a developer, a DevOps engineer, or an organization, Whanos offers a unified way to go from <strong>code to production in one push.</strong></p>`,44)])])}const g=n(t,[["render",l]]);export{k as __pageData,g as default};
