# 🚀 Fixoo Deployment Guide

Bu loyihani production'ga deploy qilish uchun to'liq yo'riqnoma.

## 📋 Deployment Arxitekturasi

```
🌐 Frontend (Netlify)     → 🔗 API Server (Render.com)
🛡️ Admin Panel (Netlify) → 🔗 API Server (Render.com)
```

## 1️⃣ Backend API (Render.com)

### Render.com'da Web Service yarating:

1. **Repository:** GitHub'dan fixoo repository'ni bog'lang
2. **Settings:**
   ```
   Name: fixoo-api
   Environment: Node
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-here
   ALLOWED_ORIGINS=https://your-frontend.netlify.app,https://your-admin.netlify.app
   ```

4. **Auto-Deploy:** Enabled
5. **Health Check Path:** `/health`

### URL Example:
```
https://fixoo-api.onrender.com
```

## 2️⃣ Frontend (Netlify)

### Netlify'da Site yarating:

1. **Repository:** GitHub'dan fixoo repository
2. **Settings:**
   ```
   Base directory: front-end
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://fixoo-api.onrender.com/api
   ```

4. **netlify.toml** fayli qo'shilgan ✅

## 3️⃣ Admin Panel (Netlify)

### Alohida Netlify Site yarating:

1. **Repository:** Osha fixoo repository
2. **Settings:**
   ```
   Base directory: admin
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://fixoo-api.onrender.com/api
   ```

4. **netlify.toml** fayli qo'shilgan ✅

## ⚙️ Environment Variables

### Backend (Render.com):
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-key
ALLOWED_ORIGINS=https://your-frontend.netlify.app,https://your-admin.netlify.app
```

### Frontend (Netlify):
```env
NEXT_PUBLIC_API_URL=https://fixoo-api.onrender.com/api
```

### Admin (Netlify):
```env
NEXT_PUBLIC_API_URL=https://fixoo-api.onrender.com/api
```

## 🔧 Deploy Qadamlari

### 1. Backend'ni deploy qilish:
```bash
# render.yaml faylini push qiling
git add render.yaml
git commit -m "Add Render.com configuration"
git push origin main
```

### 2. Frontend'ni deploy qilish:
```bash
# netlify.toml'ni push qiling
git add front-end/netlify.toml
git commit -m "Add Netlify config for frontend"
git push origin main
```

### 3. Admin'ni deploy qilish:
```bash
# Admin netlify.toml'ni push qiling
git add admin/netlify.toml
git commit -m "Add Netlify config for admin"
git push origin main
```

## 🛡️ Security Sozlamalari

### CORS:
- Faqat sizning domain'laringizga ruxsat
- Production'da localhost bloklanadi

### Headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block

### Rate Limiting:
- 100 request/15 min har IP uchun

## 📊 Monitoring

### Health Check URLs:
- **Backend:** `https://fixoo-api.onrender.com/health`
- **Frontend:** `https://your-frontend.netlify.app`
- **Admin:** `https://your-admin.netlify.app`

## 🚨 Troubleshooting

### Backend Issues:
```bash
# Render.com logs tekshiring
# Environment variables to'g'ri ekanligini tasdiqlang
# Health check endpoint ishlab turganini tekshiring
```

### Frontend Issues:
```bash
# Netlify deploy logs tekshiring
# API URL to'g'ri ekanligini tasdiqlang
# CORS xatolari uchun network tab'ni tekshiring
```

## 📝 Post-Deployment Checklist

- [ ] Backend health check ishlayapti
- [ ] Frontend yuklanayapti
- [ ] Admin panel ochilayapti
- [ ] API calls ishlayapti
- [ ] CORS sozlamalari to'g'ri
- [ ] Authentication ishlayapti
- [ ] File upload ishlayapti (agar bor bo'lsa)

## 🔄 Updates

### Code yangilanishi:
1. Local'da test qiling
2. GitHub'ga push qiling
3. Render va Netlify avtomatik deploy qiladi

### Environment Variables yangilanishi:
1. Render.com dashboard'da yangilang
2. Netlify dashboard'da yangilang
3. Service'larni restart qiling

---

**Muammolarga duch kelsangiz, log'larni tekshiring va environment variables'ni tasdiqlab ko'ring!** 