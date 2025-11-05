# Troubleshooting Guide

## Common Issues and Solutions

This guide helps you diagnose and fix common issues with your Whanos deployment.

## Deployment Issues

### Ansible Connection Failures

**Problem:** Cannot connect to VMs during deployment

```
UNREACHABLE! => {"changed": false, "msg": "Failed to connect to the host via ssh", "unreachable": true}
```

**Solutions:**
1. Verify SSH access:
   ```bash
   ssh root@YOUR_VM_IP
   ```

2. Check inventory file has correct IPs and credentials

3. Ensure `sshpass` is installed:
   ```bash
   sudo apt install sshpass
   ```

4. For production, use SSH keys instead of passwords

---

### Port Already in Use

**Problem:** Port 8080 or 5000 already in use

```
Error: bind: address already in use
```

**Solutions:**

For Jenkins (port 8080):
```bash
# Check what's using the port
sudo lsof -i :8080

# If it's an old Jenkins installation
sudo systemctl stop jenkins
sudo systemctl disable jenkins
```

For Docker Registry (port 5000):
```bash
# Check what's using the port
sudo lsof -i :5000

# Stop the conflicting service
sudo docker stop $(sudo docker ps -q --filter "publish=5000")
```

---

### K3s Worker Nodes Not Joining

**Problem:** Worker nodes fail to join the cluster

**Solutions:**

1. Check firewall allows port 6443:
   ```bash
   sudo ufw allow 6443/tcp
   ```

2. Verify master node token:
   ```bash
   # On master
   sudo cat /var/lib/rancher/k3s/server/node-token
   ```

3. Check worker node logs:
   ```bash
   # On worker
   sudo journalctl -u k3s-agent -f
   ```

4. Manually join worker:
   ```bash
   curl -sfL https://get.k3s.io | K3S_URL=https://MASTER_IP:6443 \
     K3S_TOKEN=YOUR_TOKEN sh -
   ```

---

## Jenkins Issues

### Jenkins Won't Start

**Problem:** Jenkins container fails to start

**Solutions:**

1. Check container logs:
   ```bash
   docker logs jenkins
   ```

2. Verify Docker socket is mounted:
   ```bash
   docker inspect jenkins | grep -A 5 "Mounts"
   ```

3. Check permissions on Jenkins home:
   ```bash
   sudo chown -R 1000:1000 /var/jenkins_home
   ```

4. Restart Jenkins:
   ```bash
   docker restart jenkins
   ```

---

### Cannot Access Jenkins UI

**Problem:** Cannot reach Jenkins at `http://MASTER_IP:8080`

**Solutions:**

1. Verify Jenkins is running:
   ```bash
   docker ps | grep jenkins
   ```

2. Check port binding:
   ```bash
   docker port jenkins
   ```

3. Test from master node:
   ```bash
   curl http://localhost:8080/login
   ```

4. Check firewall:
   ```bash
   sudo ufw status
   sudo ufw allow 8080/tcp
   ```

---

### Jenkins Build Fails

**Problem:** Build jobs fail with Docker errors

**Solutions:**

1. Verify Docker socket access:
   ```bash
   docker exec jenkins docker ps
   ```

2. Check Docker credentials:
   ```bash
   docker exec jenkins cat /var/jenkins_home/.docker/config.json
   ```

3. Test registry connection:
   ```bash
   docker exec jenkins curl http://MASTER_IP:5000/v2/_catalog
   ```

4. Review build logs in Jenkins UI

---

## Docker Registry Issues

### Cannot Push to Registry

**Problem:** `docker push` fails with connection refused

**Solutions:**

1. Verify registry is running:
   ```bash
   docker ps | grep registry
   curl http://MASTER_IP:5000/v2/_catalog
   ```

2. Check Docker daemon configuration:
   ```bash
   cat /etc/docker/daemon.json
   ```
   Should contain:
   ```json
   {
     "insecure-registries": ["MASTER_IP:5000"]
   }
   ```

3. Restart Docker after config changes:
   ```bash
   sudo systemctl restart docker
   ```

4. Test push manually:
   ```bash
   docker pull hello-world
   docker tag hello-world MASTER_IP:5000/test
   docker push MASTER_IP:5000/test
   ```

---

### ImagePullBackOff in Kubernetes

**Problem:** Pods fail to pull images from registry

```
Failed to pull image "MASTER_IP:5000/app:latest": rpc error: code = Unknown
```

**Solutions:**

1. Verify registry URL in `.env` matches master IP:
   ```bash
   grep REGISTRY_URL .env
   ```

2. Check image exists in registry:
   ```bash
   curl http://MASTER_IP:5000/v2/_catalog
   curl http://MASTER_IP:5000/v2/IMAGE_NAME/tags/list
   ```

3. Test image pull from worker nodes:
   ```bash
   # On worker node
   docker pull MASTER_IP:5000/app:latest
   ```

4. Check K3s registry configuration:
   ```bash
   # On master
   sudo cat /etc/rancher/k3s/registries.yaml
   ```

---

## Kubernetes Issues

### Pods in Pending State

**Problem:** Pods remain in Pending status

**Solutions:**

1. Check pod events:
   ```bash
   kubectl describe pod POD_NAME
   ```

2. Check node resources:
   ```bash
   kubectl top nodes
   kubectl describe nodes
   ```

3. Check for taints:
   ```bash
   kubectl get nodes -o json | jq '.items[].spec.taints'
   ```

4. Verify worker nodes are ready:
   ```bash
   kubectl get nodes
   ```

---

### Service Not Accessible

**Problem:** Cannot access deployed application

**Solutions:**

1. Check service status:
   ```bash
   kubectl get svc
   kubectl describe svc SERVICE_NAME
   ```

2. Get NodePort:
   ```bash
   kubectl get svc SERVICE_NAME -o jsonpath='{.spec.ports[0].nodePort}'
   ```

3. Test from master node:
   ```bash
   curl http://localhost:NODEPORT
   ```

4. Check pod logs:
   ```bash
   kubectl logs POD_NAME
   ```

5. Verify firewall allows the NodePort (30000-32767):
   ```bash
   sudo ufw allow 30000:32767/tcp
   ```

---

### Helm Deployment Fails

**Problem:** Helm chart installation fails

**Solutions:**

1. Check Helm version:
   ```bash
   helm version
   ```

2. Validate chart syntax:
   ```bash
   helm lint helm/Whanos
   ```

3. Dry run installation:
   ```bash
   helm install --dry-run --debug APP_NAME helm/Whanos
   ```

4. Check existing releases:
   ```bash
   helm list --all-namespaces
   ```

5. Uninstall and retry:
   ```bash
   helm uninstall RELEASE_NAME
   ```

---

## Application Issues

### Build Detection Fails

**Problem:** Jenkins doesn't detect application type

**Solutions:**

1. Verify detection file exists in `app/` directory:
   - Python: `requirements.txt`
   - JavaScript: `package.json`
   - Java: `app/pom.xml`
   - C: `Makefile`
   - Befunge: `app/main.bf`

2. Check file is in correct location:
   ```
   your-repo/
   └── app/
       ├── requirements.txt  ← Must be here
       └── __main__.py
   ```

3. Review Jenkins job logs for detection output

---

### Application Build Fails

**Problem:** Application fails to build

**Solutions:**

1. Check base image is available:
   ```bash
   docker images | grep whanos
   ```

2. Test build locally:
   ```bash
   cd your-repo
   docker build -t test-build .
   ```

3. Check dependencies in requirements/package files

4. Review Jenkins console output for error messages

---

## Environment Variable Issues

### Credentials Not Working

**Problem:** GitHub/Docker Hub authentication fails

**Solutions:**

1. Verify `.env` file exists and has correct values:
   ```bash
   cat .env | grep -v PASSWORD | grep -v TOKEN
   ```

2. Regenerate tokens:
   - GitHub: Settings → Developer settings → Personal access tokens
   - Docker Hub: Account Settings → Security → New Access Token

3. Redeploy Jenkins with new credentials:
   ```bash
   ./deploy.sh
   ```

4. Check Jenkins credentials in UI:
   - Jenkins → Manage Jenkins → Credentials

---

## Performance Issues

### Slow Build Times

**Solutions:**

1. Check system resources:
   ```bash
   # CPU and memory
   top

   # Disk space
   df -h

   # Docker disk usage
   docker system df
   ```

2. Clean up Docker resources:
   ```bash
   docker system prune -a
   ```

3. Increase VM resources (CPU, RAM, disk)

4. Use Docker layer caching

---

### High Resource Usage

**Solutions:**

1. Check running containers:
   ```bash
   docker stats
   ```

2. Check Kubernetes resource usage:
   ```bash
   kubectl top pods --all-namespaces
   kubectl top nodes
   ```

3. Limit application resources in `whanos.yml`:
   ```yaml
   deployment:
     resources:
       limits:
         cpu: 500m
         memory: 512Mi
   ```

4. Scale down replicas:
   ```bash
   kubectl scale deployment APP_NAME --replicas=1
   ```

---

## Diagnostic Commands

### Quick Health Check

Run these commands to verify system health:

```bash
# Check all nodes
kubectl get nodes

# Check all pods
kubectl get pods --all-namespaces

# Check Jenkins
curl http://MASTER_IP:8080/login

# Check registry
curl http://MASTER_IP:5000/v2/_catalog

# Check Docker
docker ps
docker images

# Check system resources
df -h
free -h
```

---

### Collect Logs

For troubleshooting with support:

```bash
# Jenkins logs
docker logs jenkins > jenkins.log 2>&1

# K3s logs
sudo journalctl -u k3s > k3s-master.log
sudo journalctl -u k3s-agent > k3s-worker.log  # On workers

# Pod logs
kubectl logs POD_NAME > pod.log

# Describe resources
kubectl describe pod POD_NAME > pod-describe.txt
kubectl describe node NODE_NAME > node-describe.txt
```

---

## Getting Help

If you're still experiencing issues:

1. Check the [Configuration Reference](CONFIGURATION.md) for setup options
2. Review the [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions
3. Consult the [Architecture Overview](ARCHITECTURE.md) to understand system design
4. Search GitHub issues for similar problems
5. Open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Error messages and logs
   - Environment details (OS, versions)

---

## Prevention Tips

- **Regular updates:** Keep Docker, Kubernetes, and Jenkins updated
- **Resource monitoring:** Set up alerts for resource usage
- **Backup strategy:** Regular backups of Jenkins home and K3s data
- **Documentation:** Document custom configurations
- **Testing:** Test deployments in a staging environment first
