# 🛠️ Fixoo - Professional Services Platform

**Fixoo** - bu professional xizmatlar uchun platforma bo'lib, mijozlar va mutaxassislarni bog'laydi. Platforma orqali mijozlar o'zlariga kerakli xizmatlarni topishi va buyurtma berishlari mumkin.

## 🚀 Tizim Komponentlari

### 1. Backend API Server
- **Port:** 5000
- **Texnologiya:** Node.js, Express.js
- **Ma'lumotlar:** JSON file-based (development)
- **Autentifikatsiya:** JWT

### 2. Admin Panel
- **Port:** 3001
- **Texnologiya:** Next.js 14, TypeScript, Tailwind CSS
- **Xususiyatlari:** Real-time dashboard, User management, Order tracking

### 3. Main Frontend App
- **Port:** 3000
- **Texnologiya:** Next.js 14, TypeScript, Tailwind CSS
- **Xususiyatlari:** Service booking, Specialist profiles, Order management

## 📋 O'rnatish

### Talablar
- Node.js 18+ 
- npm yoki yarn

### Backend Server
```bash
cd server
npm install
npm start
```

### Admin Panel
```bash
cd admin
npm install
npm run dev
```

### Frontend App
```bash
cd front-end
npm install
npm run dev
```

## 🔐 Admin Panel Kirish

- **URL:** http://localhost:3001
- **Foydalanuvchi:** sofiya_7
- **Parol:** sofiya_7

## 🛡️ Xavfsizlik

- JWT token autentifikatsiya
- Rate limiting (100 request/15 min)
- CORS himoyasi
- Parol hashing (bcrypt)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Kirish
- `POST /api/auth/register/client` - Mijoz ro'yxatdan o'tish
- `POST /api/auth/register/specialist` - Mutaxassis ro'yxatdan o'tish
- `POST /api/auth/admin/login` - Admin kirish

### Users
- `GET /api/users` - Barcha foydalanuvchilar
- `GET /api/users/:id` - Foydalanuvchi ma'lumotlari
- `PUT /api/users/:id` - Profil yangilash
- `DELETE /api/users/:id` - Akkaunt o'chirish

### Orders
- `GET /api/orders` - Buyurtmalar ro'yxati
- `POST /api/orders` - Yangi buyurtma
- `PUT /api/orders/:id` - Buyurtma yangilash
- `POST /api/orders/:id/accept` - Buyurtmani qabul qilish
- `POST /api/orders/:id/complete` - Buyurtmani yakunlash

## 🎨 Texnologiyalar

### Backend
- Express.js - Web framework
- bcryptjs - Parol xavfsizligi
- jsonwebtoken - Autentifikatsiya
- cors - Cross-origin resurslar
- helmet - Xavfsizlik headers
- express-rate-limit - Rate limiting

### Frontend
- Next.js 14 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Lucide React - Ikonlar
- Recharts - Grafiklar (optional)

## 🏗️ Arxitektura

```
fixoo/
├── server/           # Backend API
│   ├── models/      # Data modellari
│   ├── routes/      # API yo'llari
│   ├── middleware/  # Middleware funksiyalari
│   └── data/        # JSON ma'lumotlar
├── admin/           # Admin panel
│   ├── src/app/     # Next.js app directory
│   └── src/lib/     # Utility funksiyalar
└── front-end/       # Asosiy frontend
    ├── app/         # Next.js app directory
    └── components/  # React komponentlari
```

## 📈 Kelajakdagi Rejalar

- [ ] PostgreSQL/MongoDB integratsiyasi
- [ ] Real-time chat
- [ ] SMS/Email xabarnomalar
- [ ] Payment gateway integratsiyasi
- [ ] Mobile app (React Native)

## 👥 Jamoa

**Fixoo** - professional xizmatlar platformasi

## 📄 Litsenziya

Ushbu loyiha xususiy mulk hisoblanadi.

---

**Muammo yoki takliflaringiz bo'lsa, bizga murojaat qiling!**