# CineMarathi EC2 deployment (live)

Domains:

- **API:** https://api.cine.fluttertales.tech
- **Admin:** https://admin.cine.fluttertales.tech

## 1. Server setup (Ubuntu/Debian)

```bash
# Node 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx

# PM2
sudo npm install -g pm2
```

## 2. App on EC2

```bash
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone <your-repo> cinemarathi-api
cd cinemarathi-api
```

## 3. Backend

```bash
cd cine-apis
cp .env.example .env
# Edit .env: DB_*, JWT_SECRET, AWS_*, FIREBASE path, etc.
npm ci
mkdir -p logs
```

## 4. Frontend

```bash
cd ../admin-panel
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=https://api.cine.fluttertales.tech
# Set NEXT_PUBLIC_ENVIRONMENT=live
npm ci
npm run build
mkdir -p logs
```

## 5. PM2

From `cine-apis` (ecosystem starts both apps):

```bash
cd /var/www/cinemarathi-api/cine-apis
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Set `CINEMARATHI_APP_DIR=/var/www/cinemarathi-api` if needed.

## 6. Nginx / SSL

Point **api.cine.fluttertales.tech** and **admin.cine.fluttertales.tech** DNS A records to this EC2 public IP, then configure Nginx reverse proxies to:

- API → `http://127.0.0.1:3001`
- Admin → `http://127.0.0.1:3000`

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.cine.fluttertales.tech -d admin.cine.fluttertales.tech
```

## Useful commands

```bash
pm2 status
pm2 logs
pm2 restart all
```
