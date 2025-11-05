# Security Best Practices

## Overview

This guide covers security considerations for your Whanos deployment.

## Credentials Management

### Environment Variables

- **Never commit `.env` files** to version control
- Use strong passwords for all services
- Rotate tokens and passwords regularly

```bash
# Example .env structure
ADMIN_PASSWORD=strong_random_password_here
DOCKER_HUB_TOKEN=your_secure_token
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

### Ansible Vault

For production deployments, encrypt sensitive data:

```bash
# Encrypt inventory file
ansible-vault encrypt ansible/inventory.ini

# Edit encrypted file
ansible-vault edit ansible/inventory.ini

# Run playbook with vault
ansible-playbook -i ansible/inventory.ini ansible/deploy_whanos.yml --ask-vault-pass
```

## Network Security

### Firewall Configuration

Configure firewalls on all VMs to restrict access:

```bash
# Allow only necessary ports
ufw allow 22/tcp    # SSH
ufw allow 8080/tcp  # Jenkins
ufw allow 5000/tcp  # Docker Registry
ufw allow 6443/tcp  # Kubernetes API
ufw enable
```

### Service Exposure

- **Jenkins:** Restrict access to trusted IPs only
- **Docker Registry:** Use authentication (add in future releases)
- **Kubernetes API:** Limit access to master node

## Authentication

### SSH Keys

Use SSH keys instead of passwords for production:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "whanos-deploy"

# Copy to VMs
ssh-copy-id root@MASTER_IP
ssh-copy-id root@WORKER1_IP
ssh-copy-id root@WORKER2_IP
```

Update `inventory.ini`:

```ini
[jenkins_master]
master ansible_host=YOUR_MASTER_IP ansible_user=root ansible_ssh_private_key_file=~/.ssh/id_ed25519

[k3s_workers]
worker1 ansible_host=YOUR_WORKER1_IP ansible_user=root ansible_ssh_private_key_file=~/.ssh/id_ed25519
```

### Jenkins Security

- Use strong admin password
- Enable CSRF protection (enabled by default in Configuration as Code)
- Regularly update Jenkins and plugins
- Use role-based access control for teams

### Docker Registry Security

Current implementation uses HTTP registry. For production:

1. **Add TLS certificates:**
   ```bash
   # Generate self-signed cert (or use Let's Encrypt)
   openssl req -newkey rsa:4096 -nodes -sha256 -keyout registry.key -x509 -days 365 -out registry.crt
   ```

2. **Add authentication:**
   ```bash
   # Create htpasswd file
   htpasswd -Bc registry.htpasswd username
   ```

3. **Update registry configuration** in Ansible playbook

## Kubernetes Security

### RBAC

K3s comes with RBAC enabled. Create service accounts for applications:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-deployer
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: app-deployer-role
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "create", "update"]
```

### Network Policies

Restrict pod-to-pod communication:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

### Secrets Management

Use Kubernetes secrets for sensitive data:

```bash
# Create secret
kubectl create secret generic app-secrets \
  --from-literal=db-password=secret123 \
  --from-literal=api-key=xyz789
```

Reference in deployment:

```yaml
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: app-secrets
      key: db-password
```

## Container Security

### Image Scanning

Scan images for vulnerabilities:

```bash
# Using Trivy
docker run aquasec/trivy image YOUR_REGISTRY:5000/app:latest
```

### Base Image Security

- Keep base images updated
- Use minimal images (Alpine-based when possible)
- Remove unnecessary packages

### Runtime Security

- Run containers as non-root user
- Use read-only root filesystem when possible
- Drop unnecessary capabilities

Example in Helm values:

```yaml
deployment:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    readOnlyRootFilesystem: true
    capabilities:
      drop:
      - ALL
```

## Monitoring & Auditing

### Log Collection

Monitor and collect logs:

```bash
# Jenkins logs
docker logs jenkins

# Kubernetes logs
kubectl logs -n kube-system --all-containers=true

# Audit logs
kubectl get events --all-namespaces
```

### Regular Audits

- Review user access regularly
- Check for unused deployments
- Monitor resource usage
- Scan for vulnerabilities monthly

## Backup & Recovery

### Backup Critical Data

```bash
# Backup Jenkins home
tar -czf jenkins-backup-$(date +%Y%m%d).tar.gz /var/jenkins_home/

# Backup K3s
k3s etcd-snapshot save

# Backup Docker registry
tar -czf registry-backup-$(date +%Y%m%d).tar.gz /var/lib/registry/
```

### Disaster Recovery Plan

1. Document infrastructure configuration
2. Store backups in secure location (off-site)
3. Test restoration procedures regularly
4. Maintain infrastructure-as-code (Ansible playbooks)

## Compliance Checklist

- [ ] All passwords are strong and unique
- [ ] SSH key authentication enabled
- [ ] Firewall rules configured
- [ ] Ansible vault used for sensitive data
- [ ] Jenkins secured with authentication
- [ ] Docker registry uses HTTPS (production)
- [ ] Kubernetes RBAC configured
- [ ] Regular security updates scheduled
- [ ] Backup strategy implemented
- [ ] Audit logs monitored

## Reporting Security Issues

If you discover a security vulnerability, please contact the maintainers directly instead of opening a public issue.

## Related Documentation

- [Configuration Reference](CONFIGURATION.md) - Security-related configuration options
- [Troubleshooting](TROUBLESHOOTING.md) - Security-related issues
- [Deployment Guide](DEPLOYMENT.md) - Secure deployment practices

---

**Note:** This is an educational project. For production use, conduct a thorough security audit and implement additional hardening measures based on your organization's security policies.
