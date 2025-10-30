# Deployment Guide

This guide covers deploying your Express backend to production environments.

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested (if applicable)
- [ ] All tests passing
- [ ] Security headers configured
- [ ] CORS origins set correctly
- [ ] Rate limiting configured
- [ ] Logging level set appropriately
- [ ] Docker image builds successfully
- [ ] Health checks working

## 🐳 Docker Deployment

### Build Production Image

```bash
docker build -t backend-express:latest .
```

### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  --name backend-api \
  --restart unless-stopped \
  --env-file .env.production \
  backend-express:latest
```

### Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "bun", "run", "-e", "await fetch('http://localhost:3000/health').then(r => r.ok || process.exit(1))"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

Run:
```bash
docker-compose up -d
```

## ☁️ Cloud Platform Deployment

### AWS ECS/Fargate

1. **Push image to ECR**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker tag backend-express:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/backend-express:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/backend-express:latest
   ```

2. **Create Task Definition**
   - Use Fargate launch type
   - Configure health checks: `/health/live` and `/health/ready`
   - Set environment variables
   - Configure logging to CloudWatch

3. **Create Service**
   - Use Application Load Balancer
   - Configure target group health checks
   - Set desired task count
   - Enable auto-scaling

### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/backend-express

# Deploy to Cloud Run
gcloud run deploy backend-express \
  --image gcr.io/PROJECT_ID/backend-express \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production
```

### Azure Container Instances

```bash
# Push to Azure Container Registry
az acr build --registry myregistry --image backend-express:latest .

# Deploy to Container Instance
az container create \
  --resource-group myResourceGroup \
  --name backend-express \
  --image myregistry.azurecr.io/backend-express:latest \
  --dns-name-label backend-express \
  --ports 3000
```

### DigitalOcean App Platform

1. Create `app.yaml`:
```yaml
name: backend-express
services:
  - name: api
    github:
      repo: your-username/backend-express
      branch: main
    dockerfile_path: Dockerfile
    http_port: 3000
    health_check:
      http_path: /health
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: "3000"
```

2. Deploy:
```bash
doctl apps create --spec app.yaml
```

## 🚀 Platform-as-a-Service

### Heroku

```bash
# Login
heroku login

# Create app
heroku create backend-express-api

# Set buildpack
heroku buildpacks:set oven/bun

# Deploy
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set LOG_PRETTY=false
```

### Render

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: backend-express
    env: docker
    dockerfilePath: ./Dockerfile
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

2. Connect GitHub repository in Render dashboard

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## ⚙️ Environment Configuration

### Production Environment Variables

```env
NODE_ENV=production
PORT=3000
APP_NAME=backend-express
API_VERSION=v1

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_PRETTY=false

# Security
HELMET_ENABLED=true
TRUST_PROXY=true

# Health Check
HEALTH_CHECK_PATH=/health
METRICS_ENABLED=true

# Better Auth
BETTER_AUTH_URL=https://api.yourdomain.com
BETTER_AUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
FRONTEND_URL=https://yourdomain.com

# Database (Prisma)
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
DIRECT_URL=postgresql://user:password@host:5432/database?schema=public
```

## 🔒 Security Best Practices

1. **Never commit secrets** - Use environment variables or secret managers
2. **Use HTTPS** - Always use TLS in production
3. **Enable TRUST_PROXY** - If behind load balancer/proxy
4. **Set CORS carefully** - Don't use `*` in production when credentials are enabled
5. **Generate strong BETTER_AUTH_SECRET** - Use a long, random secret key
6. **Set correct BETTER_AUTH_URL** - Must match your backend API URL
7. **Secure database connections** - Use SSL for production database
8. **Rate limiting** - Adjust based on your needs
9. **Keep dependencies updated** - Regularly update packages
10. **Configure email service** - Implement email sending for auth flows

## 📊 Monitoring

### Health Checks

Configure your load balancer/platform to use:
- **Liveness Probe**: `GET /health/live`
  - Checks if app is running
  - Restart container if fails
  
- **Readiness Probe**: `GET /health/ready`
  - Checks if app is ready to serve traffic
  - Remove from load balancer if fails

### Logging

In production:
- Set `LOG_PRETTY=false` for structured JSON logs
- Use log aggregation (CloudWatch, Datadog, Loggly, etc.)
- Set appropriate `LOG_LEVEL` (info or warn)

### Metrics

Health check endpoint provides:
- Memory usage
- CPU usage
- Process uptime
- System metrics

Integrate with monitoring tools:
- Prometheus
- Grafana
- Datadog
- New Relic

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
      - run: bun run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t backend-express:latest .
      
      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push backend-express:latest
      
      - name: Deploy
        run: |
          # Your deployment script here
```

## 🔧 Troubleshooting

### Container won't start
- Check logs: `docker logs backend-express`
- Verify environment variables
- Check health endpoint manually

### High memory usage
- Monitor `/health/detailed` endpoint
- Adjust container memory limits
- Check for memory leaks

### Rate limiting too strict
- Adjust `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`
- Consider IP whitelisting for trusted clients

## 📝 Post-Deployment

1. **Verify health checks** - Ensure all health endpoints return 200
2. **Test API endpoints** - Run smoke tests against production
3. **Monitor logs** - Watch for errors in first few hours
4. **Check metrics** - Monitor CPU, memory, response times
5. **Test load** - Gradually increase traffic

## 🚨 Rollback Strategy

If issues occur:

1. **Docker**:
   ```bash
   docker stop backend-express
   docker run -d <previous-version>
   ```

2. **Cloud platforms**: Use platform-specific rollback features

3. **Keep previous versions** - Don't delete old images immediately

---

**Need Help?** Check the logs first, then consult platform documentation.

