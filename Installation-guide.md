# Express + Prisma + PostgreSQL + TypeScript Kurulum Rehberi

## 📋 ÖN HAZIRLIK
- PostgreSQL kurulu olmalı (yerel veya cloud - Supabase, Railway, Neon)
- Node.js kurulu olmalı (v18+)

---

## 🔧 KURULUM ADIMLARI

### 1. Proje Klasörü Oluştur
```bash
mkdir backend-project
cd backend-project
```

### 2. Package.json Oluştur
```bash
npm init -y
```

### 3. TypeScript Paketlerini Yükle
```bash
npm install typescript ts-node @types/node tsx --save-dev
```

### 4. TypeScript Yapılandırması
```bash
npx tsc --init
```

**tsconfig.json ayarları:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Express Paketlerini Yükle
```bash
npm install express
npm install @types/express --save-dev
```

### 6. Bcrypt Yükle (Şifre Hash)
```bash
npm install bcrypt
npm install @types/bcrypt --save-dev
```

### 7. Dotenv Yükle
```bash
npm install dotenv
```

### 8. Prisma Paketlerini Yükle
```bash
### daha dusuk surumler kullan
npm install prisma@5.22.0 @prisma/client@5.22.0

npm install prisma --save-dev
npm install @prisma/client
```

### 9. Prisma Başlat
```bash
npx prisma init --datasource-provider postgresql
```

---

## 🗂️ DOSYA YAPILANDIRMASI

### 10. .env Dosyası
```env
DATABASE_URL="postgresql://kullanici_adi:sifre@localhost:5432/veritabani_adi"
PORT=3000
JWT_SECRET="gizli_anahtar"
```

**Örnekler:**
```env
# Yerel
DATABASE_URL="postgresql://postgres:12345@localhost:5432/mydb"

# Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

### 11. .gitignore Dosyası
```gitignore
node_modules/
.env
.env.local
.env.*.local
dist/
build/
*.log
.DS_Store
Thumbs.db
.vscode/
.idea/
prisma/migrations/
```

### 12. Prisma Schema (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 13. Migration Çalıştır
```bash
npx prisma migrate dev --name init
```

### 14. Prisma Client Generate
```bash
npx prisma generate
```

---

## 📁 PROJE YAPISI

### 15. Klasör Yapısı Oluştur
```bash
mkdir src
mkdir src/utils
```

**Sonuç:**
```
backend-project/
├── src/
│   ├── utils/
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 💻 KOD YAZIMI

### 16. Prisma Client (src/utils/prisma.ts)
```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### 17. Ana Server (src/index.ts)
```typescript
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "./utils/prisma";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Test
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server çalışıyor! 🚀" });
});

// Kullanıcı Oluştur
app.post("/user", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: "Kullanıcı oluşturulamadı" });
  }
});

// Giriş
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Hatalı şifre" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: "Giriş başarılı", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Giriş başarısız" });
  }
});

// Tüm Kullanıcılar
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Kullanıcılar getirilemedi" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server ${port} portunda çalışıyor`);
});
```

---

## 🎯 PACKAGE.JSON SCRIPTS

### 18. Scripts Ekle
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

---

## ▶️ SUNUCUYU ÇALIŞTIR

### 19. Development Mode
```bash
npm run dev
```

### 20. Prisma Studio (Veritabanı GUI)
```bash
npm run prisma:studio
```

---

## ✅ ÖNEMLİ NOTLAR

1. **.env dosyası GİZLİ tutulmalı** - Git'e yükleme!
2. **Şifreler asla düz metin saklanmamalı** (bcrypt kullan)
3. **Migration dosyalarını** production'a taşı
4. **PORT ve JWT_SECRET** değerlerini güncelle

---

## 📦 TÜM KOMUTLAR ÖZET

```bash
# Kurulum
npm init -y
npm install typescript ts-node @types/node tsx --save-dev
npx tsc --init
npm install express @types/express --save-dev
npm install bcrypt @types/bcrypt --save-dev
npm install dotenv
npm install prisma --save-dev
npm install @prisma/client
npx prisma init --datasource-provider postgresql

# Geliştirme
npx prisma migrate dev --name init
npx prisma generate
npm run dev
npm run prisma:studio
```


Veri tabani verilerini silme scripti

script/clearDatebase.ts

import prisma from '../src/utils/prisma';

/**
 * Veritabanındaki tüm verileri siler (yapıyı korur)
 * UYARI: Bu işlem geri alınamaz!
 */
async function clearAllData() {
    try {
        console.log('🗑️  Veritabanı temizleniyor...\n');

        // Sıralama önemli! Foreign key ilişkilerine göre ters sırada silme yapılmalı

        // 1. Order ile ilgili tablolar
        console.log('📦 Sipariş verileri siliniyor...');
        await prisma.orderItem.deleteMany({});
        console.log('  ✓ OrderItem tablosu temizlendi');
        
        await prisma.order.deleteMany({});
        console.log('  ✓ Order tablosu temizlendi');

        // 2. Cart ile ilgili tablolar
        console.log('\n🛒 Sepet verileri siliniyor...');
        await prisma.cartItem.deleteMany({});
        console.log('  ✓ CartItem tablosu temizlendi');
        
        await prisma.cart.deleteMany({});
        console.log('  ✓ Cart tablosu temizlendi');

        // 3. Product ile ilgili tablolar
        console.log('\n📦 Ürün verileri siliniyor...');
        await prisma.productComment.deleteMany({});
        console.log('  ✓ ProductComment tablosu temizlendi');
        
        await prisma.productPhoto.deleteMany({});
        console.log('  ✓ ProductPhoto tablosu temizlendi');
        
        await prisma.productVariant.deleteMany({});
        console.log('  ✓ ProductVariant tablosu temizlendi');
        
        await prisma.product.deleteMany({});
        console.log('  ✓ Product tablosu temizlendi');

        // 4. Category
        console.log('\n📁 Kategori verileri siliniyor...');
        await prisma.category.deleteMany({});
        console.log('  ✓ Category tablosu temizlendi');

        // 5. User ile ilgili tablolar
        console.log('\n👤 Kullanıcı verileri siliniyor...');
        await prisma.userAddress.deleteMany({});
        console.log('  ✓ UserAddress tablosu temizlendi');
        
        await prisma.user.deleteMany({});
        console.log('  ✓ User tablosu temizlendi');

        // 6. Diğer tablolar
        console.log('\n🚚 Kargo metodları siliniyor...');
        await prisma.shippingMethod.deleteMany({});
        console.log('  ✓ ShippingMethod tablosu temizlendi');

        console.log('\n✅ Tüm veriler başarıyla silindi!');
        console.log('📊 Veritabanı yapısı korundu.\n');

    } catch (error) {
        console.error('❌ Hata oluştu:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Script çalıştırma
clearAllData()
    .then(() => {
        console.log('✨ İşlem tamamlandı!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 İşlem başarısız:', error);
        process.exit(1);
    });
t

terminalden backend dizinine gel
cd "d:\SoftWare\OnlyJs\Bitirme Projesi\back-end"
terminalden komutu calistir
npx tsx scripts/clearDatabase.ts