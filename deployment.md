# Full-Stack Proje Deployment Yol Haritası (Gerçek Dünya Tecrübeleriyle)

Bu döküman, React (Vite) frontend ve ElysiaJS (Bun) backend'den oluşan bir projenin, sıfırdan bir Ubuntu sunucusuna nasıl canlıya alındığını, karşılaşılan yaygın sorunları ve çözümlerini adım adım anlatmaktadır.

---

## Faz 1: Sunucu Hazırlığı ve Kurulumlar

Bu fazın amacı, projemizi ağırlayacak olan sanal sunucuyu (VPS) hazırlamak, güvenli hale getirmek ve üzerine gerekli tüm teknolojileri kurmaktı.

### Adım 1.1: VPS (Sanal Sunucu) Kiralama
- **Ne yaptık?** DigitalOcean'dan Ubuntu işletim sistemli, en düşük seviyeli bir sanal sunucu ("Droplet") kiraladık.
- **Öğrenilen Ders:** Hetzner, DigitalOcean, Vultr gibi birçok sağlayıcı var. Yeni hesap doğrulamaları veya ödeme sorunları yaşanabiliyor. Önemli olan, üzerinde tam kontrol sahibi olacağımız boş bir Linux sunucusu elde etmekti.

### Adım 1.2: Temel Sunucu Güvenliği
- **Ne yaptık?**
    1. `ssh root@SUNUCU_IP_ADRESI` ile sunucuya en yetkili kullanıcı `root` olarak bağlandık.
    2. `adduser deploy` ile günlük işler için `deploy` adında yeni bir kullanıcı oluşturduk.
    3. `usermod -aG sudo deploy` ile bu yeni kullanıcıya yönetici yetkileri (`sudo`) verdik.
    4. `exit` ile `root`'tan çıkıp, `ssh deploy@SUNUCU_IP_ADRESI` ile yeni kullanıcımızla tekrar bağlandık.
- **Öğrenilen Ders:** Sunucuda her zaman `root` olarak çalışmak çok tehlikelidir. `sudo` yetkilerine sahip normal bir kullanıcı oluşturmak, sistemi yanlışlıkla bozma riskini en aza indirir. Proje dosyalarının hangi kullanıcının ev dizininde (`/home/deploy`) olduğunu unutmamak çok önemli.

### Adım 1.3: Güvenlik Duvarı (Firewall) Kurulumu
- **Ne yaptık?**
    1. `sudo ufw allow OpenSSH` ile kendimizi dışarıda bırakmamak için SSH bağlantılarına izin verdik.
    2. `sudo ufw enable` ile güvenlik duvarını aktif ettik.
- **Öğrenilen Ders:** Güvenlik duvarı, sunucunun kapılarını kontrol eder. İhtiyaç olmayan portları kapatmak, temel bir güvenlik adımıdır.

### Adım 1.4: Gerekli Teknolojilerin Kurulumu
- **Nginx (Web Sunucusu):**
    - **Ne yaptık?** `sudo apt install nginx -y` ile kurduk. `sudo ufw allow 'Nginx Full'` ile web trafiğine izin verdik.
    - **Ne işe yarar?** Gelen istekleri karşılar. Web sitemizin dosyalarını sunar ve API'ye gelen istekleri arka plana yönlendirir (Ters Proxy).
- **Node.js ve Paket Yöneticileri:**
    - **Ne yaptık?** Güncel Node.js (v20) sürümünü kurduk. Önce `pnpm` denedik ama sonra projenin asıl yöneticisinin `bun` olduğunu fark ettik.
    - **Karşılaşılan Sorun:** `bun` kurulumu `unzip` paketinin eksik olduğunu söyledi.
    - **Çözüm:** `sudo apt install unzip -y` ile eksik paketi kurduk.
    - **Karşılaşılan Sorun:** `bun` komutu tanınmadı ("command not found").
    - **Çözüm:** `source ~/.bashrc` komutu veya sunucudan çıkıp tekrar girmek, terminalin yeni kurulan programı tanımasını sağladı.
- **PostgreSQL (Veritabanı):**
    - **Ne yaptık?** `sudo apt install postgresql postgresql-contrib -y` ile kurduk. `sudo -i -u postgres` ile `postgres` kullanıcısına geçip `psql` arayüzüne girdik. `CREATE DATABASE kutuphane_db;` ve `CREATE USER kutuphane_user WITH PASSWORD '...';` komutlarıyla veritabanımızı ve kullanıcımızı oluşturduk.
- **Redis (Önbellek):**
    - **Ne yaptık?** `sudo apt install redis-server -y` ile kurduk.
- **PM2 (Süreç Yöneticisi):**
    - **Ne yaptık?** `sudo npm install -g pm2` ile kurduk.
    - **Ne işe yarar?** API uygulamamız çöktüğünde onu otomatik yeniden başlatır ve sunucu açıldığında uygulamanın da başlamasını sağlar.
- **Git (Versiyon Kontrol):**
    - **Ne yaptık?** `sudo apt install git -y` ile kurduk.

---

## Faz 2: API'nin Canlıya Alınması
Bu fazın amacı, sunucuya çektiğimiz API kodunu, kurduğumuz servislerle (Postgres, Redis) konuşturup 7/24 çalışır hale getirmekti.

### Adım 2.1: Kodu Sunucuya Çekme ve Kurulum
- **Ne yaptık?**
    1. `git clone https://github.com/seferogluemre/LibraryManagement.git` ile projeyi sunucuya indirdik.
    2. `cd LibraryManagement/api` ile API klasörüne girdik.
    3. `bun install` ile gerekli paketleri kurduk.

### Adım 2.2: Ortam Değişkenleri (.env)
- **Ne yaptık?** `nano .env` ile API'nin hassas bilgilerini (veritabanı şifresi, JWT anahtarı) içeren `.env` dosyasını oluşturduk.
- **Öğrenilen Ders:** `.env` dosyası asla `git`'e gönderilmez, her ortam için (lokal, canlı) ayrı ayrı oluşturulur.

### Adım 2.3: Veritabanı ve Çalıştırma (EN BÜYÜK SAVAŞ)
- **Ne yaptık?**
    1. Veritabanı şemasını `bunx prisma migrate deploy` ile veritabanına uyguladık.
    2. API'yi PM2 ile `pm2 start ...` komutuyla çalıştırmayı denedik.
- **Karşılaşılan Sorun:** Sürekli `Cannot find module '@prisma/client'` hatası aldık. Uygulama `errored` durumuna düşüyordu.
- **Bulunan Asıl Neden:** Logları incelediğimizde `Killed` mesajını gördük. Bunun anlamı, sunucunun **RAM'inin (512MB) yetmemesiydi.** `prisma generate` gibi komutlar çok fazla bellek tüketiyordu.
- **Çözüm:** `sudo fallocate -l 4G /swapfile` gibi komutlarla diskten **4GB'lık sanal RAM (Swap Alanı)** oluşturduk. Bu, sunucunun zorlu kurulum anlarında daha fazla belleğe sahip olmasını sağladı.
- **Öğrenilen Ders:** Düşük kaynaklı sunucularda karşılaşılan "anlamsız" hataların veya donmaların arkasında genellikle yetersiz RAM vardır. Swap alanı eklemek hayat kurtarır.
- **Final Çözüm:** `bun src/index.ts` ile uygulamanın derlenmeden, doğrudan çalıştığını kanıtladık. Sonra bu çalışan komutu `pm2 start bun --name "kutuphane-api" -- run start` şeklinde PM2'ye vererek API'yi başarıyla canlıya aldık.

---

## Faz 3: Web Arayüzünün Canlıya Alınması
Bu fazın amacı, React ile yazdığımız web arayüzünü, Nginx'in sunabileceği statik dosyalara dönüştürüp sunucuya yüklemekti.

### Adım 3.1: Lokal Build Stratejisi
- **Karşılaşılan Sorun:** Sunucudaki 512MB RAM + 4GB Swap bile, frontend `build` işleminin donmasına veya çok uzun sürmesine neden oldu.
- **Çözüm (En Doğru Yöntem):** `build` işlemini sunucuda yapmaktan vazgeçtik. Kendi güçlü lokal bilgisayarımızda `bun run build` komutunu çalıştırdık.
- **Öğrenilen Ders:** Sunucuları, özellikle düşük kaynaklı olanları, ağır derleme işlemleriyle yormamak en iyisidir. "Lokalde derle, sunucuya sadece sonucu yükle" en temiz yöntemdir.

### Adım 3.2: Dosyaları Sunucuya Yükleme
- **Ne yaptık?**
    1. Lokalde oluşan `dist` klasörünü, `scp -r ./web/dist deploy@...` komutuyla sunucuya kopyaladık.
    2. Nginx'in bu dosyalara erişebilmesi için, dosyaları `deploy` kullanıcısının ev dizininden, standart web kök dizini olan `/var/www/html/ummumihcenkutuphane.uk` içine taşıdık.
- **Öğrenilen Ders:** Nginx'in, güvenlik nedeniyle kullanıcıların ev dizinlerine (`/home/*`) erişimi kısıtlı olabilir. Web dosyalarını `/var/www/html` altına koymak en standart ve sorunsuz yöntemdir.

---

## Faz 4: Domain, Nginx ve SSL Yapılandırması (Son Adımlar)
### Adım 4.1: DNS Yapılandırması
- **Ne yaptık?** Cloudflare üzerinden bir domain aldık. DNS paneline giderek, hem ana domain (`@`) hem de `api` subdomain'i için, sunucumuzun IP adresini gösteren iki adet `A Kaydı` oluşturduk.

### Adım 4.2: Nginx ile Ters Proxy
- **Ne yaptık?** `sudo nano /etc/nginx/sites-available/kutuphane` ile yeni bir konfigürasyon dosyası oluşturduk.
- **İçine Ne Yazdık?** İki adet `server` bloğu oluşturduk:
    - Biri `ummumihcenkutuphane.uk`'e gelen istekleri `/var/www/html/...` klasöründeki web dosyalarına yönlendirdi.
    - Diğeri `api.ummumihcenkutuphane.uk`'e gelen istekleri, `proxy_pass http://localhost:3000;` direktifi ile arka planda çalışan API'mize yönlendirdi.
- **Karşılaşılan Sorun:** 500 ve 403 gibi hatalar aldık.
- **Çözüm:** Dosyaları `/var/www/html`'e taşımak ve `chmod` ile doğru izinleri vermek bu sorunları çözdü.
- **Final Adımlar:** `sudo ln -s ...` ile siteyi aktif ettik, `sudo nginx -t` ile testi geçtik ve `sudo systemctl restart nginx` ile Nginx'i yeniden başlattık.

### Adım 4.3: SSL Sertifikası (Yapamadığımız Son Adım)
- **Ne yapacaktık?** Ücretsiz SSL sağlayan `certbot` aracını kuracaktık. `sudo certbot --nginx -d ummumihcenkutuphane.uk -d api.ummumihcenkutuphane.uk` komutunu çalıştıracaktık. Bu komut, sitemizi `https`'e geçirecek ve tarayıcıda güvenli kilit ikonunun çıkmasını sağlayacaktı. 