"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatters_js_1 = require("../../src/utils/formatters.js");
/**
 * Metin Formatlama Fonksiyonları Testleri
 * Bu test dosyası, formatters.ts içindeki yardımcı fonksiyonların doğru çalıştığını doğrular.
 */
describe('Formatters', () => {
    describe('slugify', () => {
        // Başarılı Senaryo: Normal metinleri URL uyumlu slug formatına çevirir.
        it('should convert text to slug', () => {
            expect((0, formatters_js_1.slugify)('Hello World')).toBe('hello-world');
            expect((0, formatters_js_1.slugify)('Test Post 123')).toBe('test-post-123');
            expect((0, formatters_js_1.slugify)('JavaScript is Awesome')).toBe('javascript-is-awesome');
        });
        // Özel Karakter Temizleme: URL'de kullanılamayan özel karakterleri kaldırır.
        it('should remove special characters', () => {
            expect((0, formatters_js_1.slugify)('Test!@#$%Post')).toBe('testpost');
            expect((0, formatters_js_1.slugify)('Hello & World')).toBe('hello-world');
        });
        // Boşluk Yönetimi: Birden fazla boşluğu tek tire ile değiştirir.
        it('should handle multiple spaces', () => {
            expect((0, formatters_js_1.slugify)('Hello    World')).toBe('hello-world');
            expect((0, formatters_js_1.slugify)('Test  -  Post')).toBe('test-post');
        });
        // Kenar Temizleme: Başta ve sondaki gereksiz boşluk ve tireleri kaldırır.
        it('should trim leading/trailing spaces and dashes', () => {
            expect((0, formatters_js_1.slugify)('  Hello World  ')).toBe('hello-world');
            expect((0, formatters_js_1.slugify)('---Test---')).toBe('test');
        });
        // Kenar Durumu: Geçersiz girişler (null, undefined, sayı) için boş string döner.
        it('should return empty string for invalid input', () => {
            expect((0, formatters_js_1.slugify)('')).toBe('');
            expect((0, formatters_js_1.slugify)(null)).toBe('');
            expect((0, formatters_js_1.slugify)(undefined)).toBe('');
            expect((0, formatters_js_1.slugify)(123)).toBe('');
        });
    });
    /**
     * Metin Kısaltma Testleri (truncate)
     * Uzun metinleri belirtilen karakter sayısına göre keser ve sonuna '...' ekler.
     */
    describe('truncate', () => {
        // Başarılı Senaryo: Maksimum uzunluğu aşan metinleri keser ve '...' ekler.
        it('should truncate long text', () => {
            const longText = 'This is a very long text that should be truncated';
            expect((0, formatters_js_1.truncate)(longText, 20)).toBe('This is a very long ...');
        });
        // Kısa Metin Senaryosu: Maksimum uzunluktan kısa metinleri olduğu gibi bırakır.
        it('should not truncate short text', () => {
            expect((0, formatters_js_1.truncate)('Short text', 20)).toBe('Short text');
            expect((0, formatters_js_1.truncate)('Hello', 10)).toBe('Hello');
        });
        // Varsayılan Uzunluk: maxLength parametresi verilmezse 100 karakter kullanır.
        it('should use default max length of 100', () => {
            const text = 'a'.repeat(150);
            const result = (0, formatters_js_1.truncate)(text);
            expect(result.length).toBe(103); // 100 + '...'
            expect(result.endsWith('...')).toBe(true);
        });
        // Kenar Durumu: Geçersiz girişler için orijinal değeri döner (tip kontrolü).
        it('should return original value for invalid input', () => {
            expect((0, formatters_js_1.truncate)(null)).toBe(null);
            expect((0, formatters_js_1.truncate)(undefined)).toBe(undefined);
            expect((0, formatters_js_1.truncate)(123)).toBe(123);
        });
    });
    /**
     * Baş Harf Büyütme Testleri (capitalize)
     * Metnin ilk harfini büyük, geri kalanını küçük harf yapar.
     */
    describe('capitalize', () => {
        // Başarılı Senaryo: İlk harfi büyük, diğer harfleri küçük yapar.
        it('should capitalize first letter', () => {
            expect((0, formatters_js_1.capitalize)('hello')).toBe('Hello');
            expect((0, formatters_js_1.capitalize)('WORLD')).toBe('World');
            expect((0, formatters_js_1.capitalize)('javaScript')).toBe('Javascript');
        });
        // Tek Karakter Senaryosu: Tek harfli metinleri de doğru şekilde büyütür.
        it('should handle single character', () => {
            expect((0, formatters_js_1.capitalize)('a')).toBe('A');
        });
        // Kenar Durumu: Geçersiz girişler için boş string döner.
        it('should return empty string for invalid input', () => {
            expect((0, formatters_js_1.capitalize)('')).toBe('');
            expect((0, formatters_js_1.capitalize)(null)).toBe('');
            expect((0, formatters_js_1.capitalize)(undefined)).toBe('');
            expect((0, formatters_js_1.capitalize)(123)).toBe('');
        });
    });
    /**
     * Tarih Formatlama Testleri (formatDate)
     * Date nesnesini okunabilir formata çevirir (örn: "January 27, 2026").
     */
    describe('formatDate', () => {
        // Başarılı Senaryo: Geçerli Date nesnesini belirtilen formatta string'e çevirir.
        it('should format date correctly', () => {
            const date = new Date('2026-01-27');
            const formatted = (0, formatters_js_1.formatDate)(date);
            expect(formatted).toBe('January 27, 2026');
        });
        // Hata Senaryosu: Geçersiz tarih değerleri için boş string döner.
        it('should return empty string for invalid date', () => {
            expect((0, formatters_js_1.formatDate)(null)).toBe('');
            expect((0, formatters_js_1.formatDate)(undefined)).toBe('');
            expect((0, formatters_js_1.formatDate)('invalid')).toBe('');
            expect((0, formatters_js_1.formatDate)(new Date('invalid'))).toBe('');
        });
    });
});
