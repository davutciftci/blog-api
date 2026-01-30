# Blog API - Test Dokumentasyonu

## 📋 Test Yapısı

Proje iki seviye test içeriyor:

### 1. **Unit Tests** (Her zaman çalışabilir)
- **Konum:** `__tests__/utils/*.test.ts`
- **Kapsamı:**
  - `validators.test.ts` - Email, password, validation fonksiyonları
  - `formatters.test.ts` - Slug, truncate, capitalize, date format
  - `auth-helpers.test.ts` - Auth validation işlemleri
  - `post-helpers.test.ts` - Post validation işlemleri
- **Coverage:** Utils modülleri %100 ✓
- **Koşul:** Prisma bağlantısı gerektirmiyor

### 2. **Integration Tests** (Database gerekli)
- **Konum:** `__tests__/integration/*.test.ts`
- **Kapsamı:**
  - `auth.test.ts` - Register, Login, Profile endpoints
  - `posts.test.ts` - Create, Read, Update, Delete posts
- **Koşul:** PostgreSQL database + `.env.test` yapılandırması
- **Status:** Currently skipped (database not available in CI/testing)

---

## 🚀 Test Komutları

### Unit Tests (Önerilen - Her zaman çalışır)
```bash
# Temel unit test'leri çalıştır
npm run test

# Unit test'leri watch modda çalıştır
npm run test:watch

# Unit test'leri coverage raporuyla çalıştır
npm run test:coverage
```

### Integration Tests (Local development)
Integration test'leri çalıştırmak için:

1. **PostgreSQL Kurulumu:**
```bash
# PostgreSQL başlat (veya Docker)
docker run --name postgres-test \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=blog_api_test \
  -p 5432:5432 \
  -d postgres
```

2. **Prisma Migrations:**
```bash
# Test database'ini setup et
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog_api_test" \
npx prisma migrate deploy
```

3. **Integration Test'leri Çalıştır:**
```bash
npm run test:integration
```

4. **Tüm Test'leri Çalıştır:**
```bash
npm run test:all
```

---

## 📊 Current Test Coverage

```
Unit Tests Status: ✅ PASSING
├── Utils: 100% ✓
│   ├── validators.ts: 100%
│   └── formatters.ts: 100%
├── Routes: 100% ✓
├── Controllers: 0% (Integration tests needed)
├── Services: 0% (Integration tests needed)
└── Middlewares: 0% (Integration tests needed)

Overall: 67 tests passing, 0 failing
Time: ~2 seconds
```

---

## 🔍 Test Dosyaları Detayları

### Unit Tests

#### `validators.test.ts` (25 tests)
```
✓ validateEmail - Email format validation
✓ validatePassword - Password security rules
✓ isEmpty - Empty/whitespace check
✓ validateLength - String length validation
✓ validateUsername - Username validation
```

#### `formatters.test.ts` (14 tests)
```
✓ slugify - URL-friendly slug generation
✓ truncate - Text truncation with ellipsis
✓ capitalize - First letter capitalization
✓ formatDate - Date formatting
```

#### `auth-helpers.test.ts` (9 tests)
```
✓ Register validation (email, password, name)
✓ Login validation (credentials check)
```

#### `post-helpers.test.ts` (19 tests)
```
✓ Create post validation (title, content, slug)
✓ Update post validation
✓ Delete post validation
✓ List/filter validation
```

### Integration Tests (Currently Skipped)

#### `auth.test.ts`
- POST /api/auth/register
  - Valid registration
  - Invalid email
  - Weak password
  - Short name
  - Duplicate email
- POST /api/auth/login
  - Correct credentials
  - Wrong password
  - Non-existent user
- GET /api/auth/profile
  - Valid token
  - Without token
  - Invalid token

#### `posts.test.ts`
- POST /api/posts - Create post
- GET /api/posts - List posts with pagination
- GET /api/posts/:id - Get single post
- PUT /api/posts/:id - Update post
- DELETE /api/posts/:id - Delete post

---

## ⚙️ Test Konfigürasyonları

### `jest.config.ts` - Unit Tests
- ESM modülleri desteği
- Prisma mock setup
- Utils dosyaları test edilir
- Integration testleri skip'lenir
- Timeout: 30 saniye

### `jest.integration.config.ts` - Integration Tests
- Real PostgreSQL database bağlantısı
- Supertest ile HTTP request'leri
- Database cleanup between tests
- Timeout: 60 saniye
- Kullanım: `npm run test:integration`

---

## 🛠️ Ortam Yapılandırması

### `.env` (Development)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog_api"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
```

### `.env.test` (Testing)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog_api_test"
JWT_SECRET="test-secret-key"
NODE_ENV="test"
```

---

## 🐛 Sorun Giderme

### "Module not found: @prisma/client"
**Çözüm:** ESM modülleri Jest tarafından properly load edilmiyor
```bash
npm install @prisma/client --save-exact
```

### "Cannot find module '...js'"
**Çözüm:** ESM imports `.js` extension gerektirir
```typescript
// Doğru
import app from '../../src/app.js';

// Yanlış
import app from '../../src/app';
```

### "Database connection refused"
**Çözüm:** PostgreSQL çalışıyor mu kontrol et
```bash
# Port 5432'de açık mı kontrol et
lsof -i :5432

# Docker container'ı başlat
docker-compose up -d postgres
```

### "Test database already exists"
**Çözüm:** Database'yi sil ve tekrar oluştur
```bash
dropdb blog_api_test
createdb blog_api_test
npx prisma migrate deploy
```

---

## 📈 Coverage Hedefleri

| Bileşen | Hedef | Mevcut |
|---------|-------|--------|
| Utils | 100% | **100%** ✓ |
| Controllers | 80% | 0% |
| Services | 80% | 0% |
| Routes | 100% | **100%** ✓ |
| Overall | 75% | 17.53% |

---

## 🔄 CI/CD Integration

GitHub Actions / GitLab CI örneği:

```yaml
test:
  script:
    - npm install
    - npm run test:coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/coverage-final.json
```

---

## 📝 En İyi Uygulamalar

1. **Unit tests'i yazarken:**
   - Prisma/Database import'ı kaçın
   - Mock'ları kullan
   - Isolated, single responsibility testler yaz

2. **Integration tests'i yazarken:**
   - Real database bağlantısı kullan
   - Database cleanup'ı unutma (beforeEach/afterEach)
   - Timeout'ları uzun yap (30-60 saniye)

3. **Test isimlerinde:**
   - Açıklayıcı olmalı
   - "should..." ile başlamalı
   - Test ettikleri özellikleri belirtmeli

4. **Coverage hedefleri:**
   - Yeni kod için minimum %80
   - Critical path'ler %100
   - Utils'ler her zaman %100

---

## 🎯 Sonraki Adımlar

1. ✅ Unit tests (Tamamlandı)
2. ⏳ Integration tests (Database setup gerekli)
3. ⏳ E2E tests (Optional - Cypress/Playwright)
4. ⏳ Performance tests (Optional - Artillery/K6)

---

**Son güncelleme:** 30 Ocak 2026  
**Kontribütor:** AI Assistant
