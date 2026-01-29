import { slugify, truncate, capitalize, formatDate } from '../../src/utils/formatters.js';

/**
 * Metin Formatlama Fonksiyonları Testleri
 * Bu test dosyası, formatters.ts içindeki yardımcı fonksiyonların doğru çalıştığını doğrular.
 */
describe('Formatters', () => {

  /**
   * URL Slug Oluşturma Testleri (slugify)
   * Metni URL'de kullanılabilir formata dönüştürür (küçük harf, tire ile ayrılmış).
   */
  describe('slugify', () => {
    // Başarılı Senaryo: Normal metinleri URL uyumlu slug formatına çevirir.
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test Post 123')).toBe('test-post-123');
      expect(slugify('JavaScript is Awesome')).toBe('javascript-is-awesome');
    });

    // Özel Karakter Temizleme: URL'de kullanılamayan özel karakterleri kaldırır.
    it('should remove special characters', () => {
      expect(slugify('Test!@#$%Post')).toBe('testpost');
      expect(slugify('Hello & World')).toBe('hello-world');
    });

    // Boşluk Yönetimi: Birden fazla boşluğu tek tire ile değiştirir.
    it('should handle multiple spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world');
      expect(slugify('Test  -  Post')).toBe('test-post');
    });

    // Kenar Temizleme: Başta ve sondaki gereksiz boşluk ve tireleri kaldırır.
    it('should trim leading/trailing spaces and dashes', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
      expect(slugify('---Test---')).toBe('test');
    });

    // Kenar Durumu: Geçersiz girişler (null, undefined, sayı) için boş string döner.
    it('should return empty string for invalid input', () => {
      expect(slugify('')).toBe('');
      expect(slugify(null as any)).toBe('');
      expect(slugify(undefined as any)).toBe('');
      expect(slugify(123 as any)).toBe('');
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
      expect(truncate(longText, 20)).toBe('This is a very long ...');
    });

    // Kısa Metin Senaryosu: Maksimum uzunluktan kısa metinleri olduğu gibi bırakır.
    it('should not truncate short text', () => {
      expect(truncate('Short text', 20)).toBe('Short text');
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    // Varsayılan Uzunluk: maxLength parametresi verilmezse 100 karakter kullanır.
    it('should use default max length of 100', () => {
      const text = 'a'.repeat(150);
      const result = truncate(text);
      expect(result.length).toBe(103); // 100 + '...'
      expect(result.endsWith('...')).toBe(true);
    });

    // Kenar Durumu: Geçersiz girişler için orijinal değeri döner (tip kontrolü).
    it('should return original value for invalid input', () => {
      expect(truncate(null as any)).toBe(null);
      expect(truncate(undefined as any)).toBe(undefined);
      expect(truncate(123 as any)).toBe(123);
    });
  });

  /**
   * Baş Harf Büyütme Testleri (capitalize)
   * Metnin ilk harfini büyük, geri kalanını küçük harf yapar.
   */
  describe('capitalize', () => {
    // Başarılı Senaryo: İlk harfi büyük, diğer harfleri küçük yapar.
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('javaScript')).toBe('Javascript');
    });

    // Tek Karakter Senaryosu: Tek harfli metinleri de doğru şekilde büyütür.
    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    // Kenar Durumu: Geçersiz girişler için boş string döner.
    it('should return empty string for invalid input', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize(null as any)).toBe('');
      expect(capitalize(undefined as any)).toBe('');
      expect(capitalize(123 as any)).toBe('');
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
      const formatted = formatDate(date);
      expect(formatted).toBe('January 27, 2026');
    });

    // Hata Senaryosu: Geçersiz tarih değerleri için boş string döner.
    it('should return empty string for invalid date', () => {
      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
      expect(formatDate('invalid' as any)).toBe('');
      expect(formatDate(new Date('invalid'))).toBe('');
    });
  });

});