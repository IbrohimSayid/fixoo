# Fixoo Admin Panel

Fixoo platformasi uchun admin boshqaruv paneli. Bu panel orqali administratorlar tizimni monitoring qilishi, foydalanuvchilar va buyurtmalarni boshqarishi mumkin.

## Xususiyatlar

### 📊 Dashboard
- Umumiy statistika (foydalanuvchilar, buyurtmalar)
- Real-time ma'lumotlar
- Haftalik grafik ko'rinish
- Bugungi faollik hisoboti

### 👥 Foydalanuvchilar boshqaruvi
- Barcha foydalanuvchilarni ko'rish
- Ustalar va mijozlarni filtrlash
- Foydalanuvchi tafsilotlarini ko'rish
- Ustalar mavjudligini boshqarish
- Qidirish va filtrlash

### 📦 Buyurtmalar boshqaruvi
- Barcha buyurtmalarni monitoring qilish
- Holat bo'yicha filtrlash
- Buyurtma tafsilotlarini ko'rish
- Baholash va sharhlarni ko'rish
- Moliyaviy ma'lumotlar

### 🔍 Real-time monitoring
- Live statistika
- Grafik ko'rinishlar
- Exportlash imkoniyatlari

## Texnologiyalar

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Cookies**: js-cookie

## O'rnatish

1. Dependencies o'rnatish:
```bash
npm install
```

2. Environment variables sozlash:
```bash
# .env.local fayl yarating
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Development serverini ishga tushirish:
```bash
npm run dev
```

4. Production build:
```bash
npm run build
npm start
```

## Foydalanish

### Development
```bash
npm run dev
```
Server `http://localhost:3001` da ishga tushadi.

### Production
```bash
npm run build
npm start
```

## API Integration

Admin panel backend API bilan ishlaydi:
- Base URL: `http://localhost:5000/api`
- Authentication: JWT tokens
- Real-time updates

### API Endpoints
- `GET /users/stats/overview` - Foydalanuvchilar statistikasi
- `GET /orders/stats/overview` - Buyurtmalar statistikasi
- `GET /orders/stats/weekly` - Haftalik statistika
- `GET /users` - Foydalanuvchilar ro'yxati
- `GET /orders` - Buyurtmalar ro'yxati

## Sahifalar

### 1. Dashboard (`/`)
- Umumiy statistika
- Grafiklar
- Bugungi faollik

### 2. Foydalanuvchilar (`/users`)
- Foydalanuvchilar ro'yxati
- Filtrlash va qidirish
- Tafsilotlar modali

### 3. Buyurtmalar (`/orders`)
- Buyurtmalar ro'yxati
- Holat monitoring
- Tafsilotli ko'rinish

## Xavfsizlik

- JWT authentication
- Role-based access control
- CORS protection
- Rate limiting

## Contributing

1. Fork qiling
2. Feature branch yarating
3. Commit qiling
4. Push qiling
5. Pull Request oching

## Muallif

Fixoo Development Team

## Litsenziya

MIT License
