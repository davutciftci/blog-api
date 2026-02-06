"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../../src/utils/validators");
/**
 * E-posta Doğrulama Testleri
 * validateEmail fonksiyonunun farklı girişler için davranışını doğrular.
 */
describe("validateEmail", () => {
    // Başarılı Senaryo: Standartlara uygun geçerli e-posta adreslerini doğrular.
    it("should return true for valid emails", () => {
        expect((0, validators_1.validateEmail)('test@example.com')).toBe(true);
        expect((0, validators_1.validateEmail)('user.name@domain.co.uk')).toBe(true);
        expect((0, validators_1.validateEmail)('user+tag@example.com.tr')).toBe(true);
    });
    // Hata Senaryosu: Formatı bozuk (eksik @, geçersiz karakter vb.) e-postaları reddeder.
    it('should return false for invalid emails', () => {
        expect((0, validators_1.validateEmail)('invalid')).toBe(false);
        expect((0, validators_1.validateEmail)('test@')).toBe(false);
        expect((0, validators_1.validateEmail)('@example.com')).toBe(false);
        expect((0, validators_1.validateEmail)('test@.com')).toBe(false);
        expect((0, validators_1.validateEmail)('')).toBe(false);
    });
    // Kenar Durumu (Edge Case): Null veya undefined değerler için false dönmelidir.
    it('should return false for null or undefined', () => {
        expect((0, validators_1.validateEmail)(null)).toBe(false);
        expect((0, validators_1.validateEmail)(undefined)).toBe(false);
    });
    // Tip Kontrolü: String veri tipi dışındaki girişler (sayı, obje, dizi) reddedilmelidir.
    it('should return false for non-string values', () => {
        expect((0, validators_1.validateEmail)(123)).toBe(false);
        expect((0, validators_1.validateEmail)({})).toBe(false);
        expect((0, validators_1.validateEmail)([])).toBe(false);
    });
});
/**
 * Şifre Güvenlik Kontrol Testleri
 * Şifrenin en az 8 karakter, büyük harf, küçük harf ve rakam içerdiğini doğrular.
 */
describe('validatePassword', () => {
    // Başarılı Senaryo: Tüm güvenlik kriterlerini karşılayan geçerli şifreler.
    it('should return true for valid passwords', () => {
        expect((0, validators_1.validatePassword)('Test1234')).toBe(true);
        expect((0, validators_1.validatePassword)('MyP@ssw0rd')).toBe(true);
        expect((0, validators_1.validatePassword)('Abcdefgh1')).toBe(true);
    });
    // Güvenlik Kuralı: 8 karakterden kısa olan şifreler güvensiz sayılır.
    it('should return false for passwords less than 8 characters', () => {
        expect((0, validators_1.validatePassword)('Test12')).toBe(false);
        expect((0, validators_1.validatePassword)('Abc1')).toBe(false);
    });
    // Güvenlik Kuralı: Hiç büyük harf içermeyen şifreler reddedilmelidir.
    it('should return false for passwords without uppercase', () => {
        expect((0, validators_1.validatePassword)('test1234')).toBe(false);
        expect((0, validators_1.validatePassword)('mypassword1')).toBe(false);
    });
    // Güvenlik Kuralı: Hiç küçük harf içermeyen şifreler reddedilmelidir.
    it('should return false for passwords without lowercase', () => {
        expect((0, validators_1.validatePassword)('TEST1234')).toBe(false);
        expect((0, validators_1.validatePassword)('MYPASSWORD1')).toBe(false);
    });
    // Güvenlik Kuralı: Hiç rakam içermeyen şifreler reddedilmelidir.
    it('should return false for passwords without numbers', () => {
        expect((0, validators_1.validatePassword)('TestPassword')).toBe(false);
        expect((0, validators_1.validatePassword)('MyPassword')).toBe(false);
    });
    // Kenar Durumu: Null veya undefined değerler şifre olarak kabul edilmez.
    it('should return false for null or undefined', () => {
        expect((0, validators_1.validatePassword)(null)).toBe(false);
        expect((0, validators_1.validatePassword)(undefined)).toBe(false);
    });
    // Tip Kontrolü: String olmayan veri tipleri reddedilmelidir.
    it('should return false for non-string values', () => {
        expect((0, validators_1.validatePassword)(12345678)).toBe(false);
        expect((0, validators_1.validatePassword)({})).toBe(false);
    });
});
/**
 * Boş Değer Kontrol Testleri (isEmpty)
 * Bir değerin boş, null, undefined veya sadece boşluktan oluşup oluşmadığını kontrol eder.
 */
describe('isEmpty', () => {
    // Başarılı Senaryo: Tamamen boş string ('') veya sadece boşluk karakterleri ('  ').
    it('should return true for empty or whitespace strings', () => {
        expect((0, validators_1.isEmpty)('')).toBe(true);
        expect((0, validators_1.isEmpty)('   ')).toBe(true);
        expect((0, validators_1.isEmpty)('\t\n')).toBe(true);
    });
    // Negatif Senaryo: İçeriği olan (dolu) stringler için false dönmelidir.
    it('should return false for non-empty strings', () => {
        expect((0, validators_1.isEmpty)('hello')).toBe(false);
        expect((0, validators_1.isEmpty)(' world ')).toBe(false);
    });
    // Kenar Durumu: Null ve undefined değerler "boş" olarak kabul edilir (true).
    it('should return true for null or undefined', () => {
        expect((0, validators_1.isEmpty)(null)).toBe(true);
        expect((0, validators_1.isEmpty)(undefined)).toBe(true);
    });
    // Tip Kontrolü: String olmayan tipler (sayı, obje vb.) validasyon mantığınca "boş" kabul edilir.
    it('should return true for non-string values', () => {
        expect((0, validators_1.isEmpty)(123)).toBe(true);
        expect((0, validators_1.isEmpty)({})).toBe(true);
    });
});
/**
 * Uzunluk Sınırları Testi (validateLength)
 * Metnin belirtilen minimum ve maksimum karakter sınırları içinde olup olmadığını doğrular.
 */
describe('validateLength', () => {
    // Başarılı Senaryo: Uzunluğu min ve max değerleri arasında olan stringler.
    it('should return true for strings within range', () => {
        expect((0, validators_1.validateLength)('hello', 1, 10)).toBe(true);
        expect((0, validators_1.validateLength)('test', 4, 4)).toBe(true);
        expect((0, validators_1.validateLength)('  hello  ', 3, 10)).toBe(true); // trimmed
    });
    // Hata Senaryosu: Minimumdan kısa veya maksimumdan uzun olan stringler.
    it('should return false for strings outside range', () => {
        expect((0, validators_1.validateLength)('hi', 3, 10)).toBe(false);
        expect((0, validators_1.validateLength)('this is too long', 1, 10)).toBe(false);
    });
    // Kenar Durumu: Null veya undefined değerler uzunluk kontrolüne giremez.
    it('should return false for null or undefined', () => {
        expect((0, validators_1.validateLength)(null, 1, 10)).toBe(false);
        expect((0, validators_1.validateLength)(undefined, 1, 10)).toBe(false);
    });
    // Tip Kontrolü: String olmayan değerler için uzunluk kontrolü yapılamaz.
    it('should return false for non-string values', () => {
        expect((0, validators_1.validateLength)(123, 1, 10)).toBe(false);
    });
});
/**
 * Kullanıcı Adı Doğrulama Testleri (validateUsername)
 * Kullanıcı adının 3-20 karakter arasında olup olmadığını kontrol eder.
 */
describe('validateUsername', () => {
    // Başarılı Senaryo: 3-20 karakter arasındaki geçerli kullanıcı adları.
    it('should return true for valid usernames', () => {
        expect((0, validators_1.validateUsername)('abc')).toBe(true); // minimum 3 karakter
        expect((0, validators_1.validateUsername)('john_doe')).toBe(true);
        expect((0, validators_1.validateUsername)('user123')).toBe(true);
        expect((0, validators_1.validateUsername)('a'.repeat(20))).toBe(true); // maksimum 20 karakter
    });
    // Hata Senaryosu: 3 karakterden kısa kullanıcı adları reddedilir.
    it('should return false for usernames shorter than 3 characters', () => {
        expect((0, validators_1.validateUsername)('ab')).toBe(false);
        expect((0, validators_1.validateUsername)('a')).toBe(false);
        expect((0, validators_1.validateUsername)('')).toBe(false);
    });
    // Hata Senaryosu: 20 karakterden uzun kullanıcı adları reddedilir.
    it('should return false for usernames longer than 20 characters', () => {
        expect((0, validators_1.validateUsername)('a'.repeat(21))).toBe(false);
        expect((0, validators_1.validateUsername)('this_is_a_very_long_username')).toBe(false);
    });
    // Boşluk Yönetimi: Başta ve sondaki boşluklar trim edilerek kontrol edilir.
    it('should trim whitespace before validation', () => {
        expect((0, validators_1.validateUsername)('  abc  ')).toBe(true); // trim sonrası 3 karakter
        expect((0, validators_1.validateUsername)('  ab  ')).toBe(false); // trim sonrası 2 karakter
    });
    // Kenar Durumu: Null veya undefined değerler için false döner.
    it('should return false for null or undefined', () => {
        expect((0, validators_1.validateUsername)(null)).toBe(false);
        expect((0, validators_1.validateUsername)(undefined)).toBe(false);
    });
    // Tip Kontrolü: String olmayan değerler reddedilir.
    it('should return false for non-string values', () => {
        expect((0, validators_1.validateUsername)(123)).toBe(false);
        expect((0, validators_1.validateUsername)({})).toBe(false);
    });
});
