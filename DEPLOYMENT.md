# Deployment Guide

This guide will help you deploy the Blog Builder application to various platforms.

## Prerequisites

Before deploying, ensure:

-   ✅ All TypeScript errors are resolved
-   ✅ Production build succeeds (`npm run build`)
-   ✅ No console errors in production mode
-   ✅ All features tested in production build

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Next.js applications.

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jrsnleons/blog-builder)

### Option 2: Deploy from Git

1. **Push to GitHub**

    ```bash
    git push origin main
    ```

2. **Import on Vercel**

    - Go to [vercel.com](https://vercel.com)
    - Click "New Project"
    - Import your GitHub repository
    - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Configuration

No environment variables are required for basic deployment. If you need custom configuration:

1. Copy `.env.example` to `.env.local`
2. Add your variables
3. Add the same variables in Vercel Dashboard → Settings → Environment Variables

## Deploy to Netlify

1. **Build Settings**

    - Build command: `npm run build`
    - Publish directory: `.next`
    - Functions directory: (leave empty)

2. **Deploy**

    ```bash
    # Install Netlify CLI
    npm install -g netlify-cli

    # Login to Netlify
    netlify login

    # Deploy
    netlify deploy --prod
    ```

3. **Or use GitHub integration**
    - Connect your repository on netlify.com
    - Netlify will auto-deploy on push

## Deploy to Railway

1. **Install Railway CLI**

    ```bash
    npm install -g @railway/cli
    ```

2. **Login and Deploy**

    ```bash
    railway login
    railway init
    railway up
    ```

3. **Or use GitHub integration**
    - Connect repository at railway.app
    - Railway will auto-deploy

## Deploy to Render

1. **Create `render.yaml`** (already included)

2. **Connect Repository**

    - Go to render.com
    - New → Web Service
    - Connect your Git repository

3. **Configuration**
    - Build Command: `npm run build`
    - Start Command: `npm start`
    - Auto-deploy on push: ✅

## Deploy to AWS Amplify

1. **Push to Git**

    ```bash
    git push origin main
    ```

2. **AWS Amplify Console**

    - Go to AWS Amplify Console
    - Connect your repository
    - Amplify will auto-detect Next.js
    - Deploy

3. **Build Settings** (auto-detected)
    ```yaml
    version: 1
    frontend:
        phases:
            preBuild:
                commands:
                    - npm ci
            build:
                commands:
                    - npm run build
        artifacts:
            baseDirectory: .next
            files:
                - "**/*"
        cache:
            paths:
                - node_modules/**/*
    ```

## Deploy with Docker

1. **Create Dockerfile** (if not exists)

    ```dockerfile
    FROM node:18-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --only=production
    COPY . .
    RUN npm run build
    EXPOSE 3000
    CMD ["npm", "start"]
    ```

2. **Build and Run**

    ```bash
    docker build -t blog-builder .
    docker run -p 3000:3000 blog-builder
    ```

3. **Deploy to Container Platform**
    - Push to Docker Hub
    - Deploy on your container platform (AWS ECS, Google Cloud Run, etc.)

## Self-Hosted Deployment

### Using PM2 (Process Manager)

1. **Install PM2**

    ```bash
    npm install -g pm2
    ```

2. **Build and Start**

    ```bash
    npm run build
    pm2 start npm --name "blog-builder" -- start
    pm2 save
    pm2 startup
    ```

3. **Configure Reverse Proxy** (Nginx example)

    ```nginx
    server {
        listen 80;
        server_name yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

### Using Systemd

1. **Create Service File** `/etc/systemd/system/blog-builder.service`

    ```ini
    [Unit]
    Description=Blog Builder
    After=network.target

    [Service]
    Type=simple
    User=www-data
    WorkingDirectory=/var/www/blog-builder
    ExecStart=/usr/bin/npm start
    Restart=on-failure

    [Install]
    WantedBy=multi-user.target
    ```

2. **Enable and Start**
    ```bash
    sudo systemctl enable blog-builder
    sudo systemctl start blog-builder
    ```

## Production Checklist

Before going live, ensure:

-   [ ] All tests pass
-   [ ] Build succeeds without errors
-   [ ] Production build tested locally (`npm start`)
-   [ ] Environment variables configured (if any)
-   [ ] Error monitoring set up (Sentry, LogRocket, etc.)
-   [ ] Analytics configured (Google Analytics, Plausible, etc.)
-   [ ] Domain configured and SSL enabled
-   [ ] Performance tested (Lighthouse score)
-   [ ] SEO metadata reviewed
-   [ ] Backup strategy in place

## Post-Deployment

### Monitor Your Application

1. **Vercel Dashboard** - Built-in analytics and logs
2. **Error Tracking** - Set up Sentry or similar
3. **Performance Monitoring** - Use Vercel Analytics or Google Lighthouse
4. **Uptime Monitoring** - Use UptimeRobot or similar

### Continuous Deployment

Most platforms support automatic deployment on git push:

1. Push to `main` branch
2. Platform automatically:
    - Pulls latest code
    - Installs dependencies
    - Runs build
    - Deploys new version
    - Rolls back on failure

### Custom Domain

1. **Vercel**

    - Dashboard → Settings → Domains
    - Add your domain
    - Configure DNS records

2. **Netlify**
    - Site Settings → Domain Management
    - Add custom domain
    - Configure DNS

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/jrsnleons/blog-builder/issues)
2. Review Next.js [deployment documentation](https://nextjs.org/docs/deployment)
3. Check platform-specific documentation

## Performance Optimization

For production, consider:

-   Enable compression (Vercel does this automatically)
-   Configure CDN for static assets
-   Enable image optimization
-   Set up proper caching headers
-   Monitor Core Web Vitals

## Security Considerations

-   Keep dependencies updated
-   Use environment variables for sensitive data
-   Enable HTTPS (automatic on most platforms)
-   Set up CORS if needed
-   Implement rate limiting for API routes (if any)

---

**Need help?** Open an issue on GitHub or check the platform-specific documentation.
