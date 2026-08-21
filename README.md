# Web Erişilebilirlik Araçları

**Sürüm: 1.0.17**

Framework veya CMS bağımlılığı olmadan çalışan, Türkçe ve İngilizce kullanıcı
tercihleri sunan web erişilebilirlik bileşeni. Standart JavaScript paketiyle,
sıkı Content Security Policy (CSP) kullanan sitelerde veya hazır WordPress
eklentisi olarak kullanılabilir.

> Bu araç kullanıcıların içeriği kendilerine uygun biçimde görüntülemesine
> yardımcı olur. Eksik alternatif metinleri, hatalı başlık sırasını, etiketsiz
> formları veya klavye tuzaklarını otomatik olarak düzeltmez. Bir sitenin WCAG
> uygunluğu sayfanın tamamı değerlendirilerek belirlenir.

## Özellikler

- Bağlantıları vurgulama
- Görselleri gizleme
- Üç kademeli metin büyütme
- Üç kademeli satır aralığı
- Sola, ortaya ve sağa metin hizalama
- Kendinden barındırılan OpenDyslexic yazı tipi
- Yüksek kontrast ve gri tonlama
- Büyük imleç
- Animasyonları durdurma
- Sayfayı sesli okuma
- Üzerine gelinen metni sesli okuma
- Okuma kılavuzu
- Tüm tercihleri sıfırlama
- Tercihleri `localStorage` içinde saklama

Arayüz Shadow DOM ile site stillerinden yalıtılır. Panel, ikonun bulunduğu
kenardan tam boy çekmece olarak açılır ve arka planı karartmaz. Sayfadaki ilk
ileri `Tab` tuşu paneli açar; `Escape` paneli kapatır.

## Hızlı entegrasyon

Çoğu site için yalnızca `dist/web-accessibility.min.js` dosyasını sunucuya
kopyalamanız yeterlidir. CSS ve OpenDyslexic fontları bu dosyanın içindedir.

### Sol alt

```html
<script
  src="/accessibility/web-accessibility.min.js?v=1.0.17"
  data-position="bottom-left"
  defer>
</script>
```

### Sağ alt

```html
<script
  src="/accessibility/web-accessibility.min.js?v=1.0.17"
  data-position="bottom-right"
  defer>
</script>
```

Varsayılan dil `tr`, varsayılan konum `bottom-left` değeridir. Desteklenen tüm
konumlar: `bottom-left`, `bottom-right`, `top-left`, `top-right`.

İngilizce arayüz için betiğe `data-language="en"` ekleyin.

## WordPress eklentisi

Kurulabilir paket:

```text
dist/imu-web-accessibility-1.0.17.zip
```

Kurulum:

1. WordPress yönetiminde **Eklentiler → Yeni Eklenti Ekle → Eklenti Yükle** bölümünü açın.
2. `imu-web-accessibility-1.0.17.zip` dosyasını yükleyin.
3. Eklentiyi etkinleştirin.
4. **Ayarlar → Web Erişilebilirlik** bölümünden `Sol alt` veya `Sağ alt` konumunu seçin.
5. Siteniz inline stil veya `data:` font kullanımını engelliyorsa **Sıkı CSP** seçeneğini etkinleştirin.

WordPress eklentisi gerekli JavaScript dosyasını `defer` ile yükler, konum
ayarını script etiketine ekler ve CSP modunda haricî CSS/font paketine geçer.
Eklenti silindiğinde kendi WordPress ayar kaydı da kaldırılır.

Eklenti kaynakları `wordpress/imu-web-accessibility/` klasöründedir.

## Sıkı CSP kullanımı

Inline stil veya `data:` font kabul etmeyen sitelerde aşağıdaki dosya yapısını
koruyun:

```text
/accessibility/
├── web-accessibility.csp.min.js
├── web-accessibility.css
└── fonts/
    ├── opendyslexic-regular.woff2
    └── opendyslexic-bold.woff2
```

Ardından CSP paketini yükleyin:

```html
<script
  src="/accessibility/web-accessibility.csp.min.js?v=1.0.17"
  data-wa-css="/accessibility/web-accessibility.css?v=1.0.17"
  data-position="bottom-left"
  defer>
</script>
```

`data-wa-css` verilmezse betik, kendisiyle aynı klasörde
`web-accessibility.css` dosyasını arar. Önerilen CSP başlangıç izinleri:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'
```

Mevcut sitenizin görsel, API, form ve diğer kaynakları için ek CSP direktifleri
gerekebilir.

## Programatik kullanım

Otomatik başlatmayı kapatıp API üzerinden yapılandırabilirsiniz:

```html
<script
  src="/accessibility/web-accessibility.min.js?v=1.0.17"
  data-wa-auto="false"
  defer>
</script>
<script>
  window.addEventListener("DOMContentLoaded", () => {
    WebAccessibility.init({
      language: "tr",
      position: "bottom-left"
    });
  });
</script>
```

Kullanılabilir metotlar:

```js
WebAccessibility.getState();
WebAccessibility.setState({ textSize: 2, highlightLinks: true });
WebAccessibility.reset();
WebAccessibility.destroy();
```

Kademeli ayarlar:

| Alan | Değerler |
|---|---|
| `textSize` | `0`: kapalı, `1`–`3`: büyütme kademesi |
| `lineSpacing` | `0`: kapalı, `1`–`3`: aralık kademesi |
| `textAlign` | `0`: varsayılan, `1`: sol, `2`: orta, `3`: sağ |

Tercih değiştiğinde `window` üzerinde `web-accessibility:change` olayı
yayınlanır:

```js
window.addEventListener("web-accessibility:change", (event) => {
  console.log(event.detail);
});
```

## Siteye özel istisnalar

- Gizlenmemesi gereken bir görsele `data-wa-keep-visible` ekleyin.
- Görsel niteliğindeki inline SVG öğelerine `data-wa-image` ekleyin.
- Yüksek kontrast modu genel bir güvenli varsayılan uygular; kurumsal temadaki özel bileşenleri ayrıca test edin.
- “Disleksi Dostu” bir yazı tipi tercihidir ve tıbbi fayda iddiası taşımaz.
- Sesli okuma tarayıcının Web Speech API desteğine bağlıdır ve ekran okuyucunun yerini almaz.
- Otomatik testler gerçek klavye ve ekran okuyucu testinin yerini tutmaz.

## Dağıtım dosyaları

| Dosya | Amaç |
|---|---|
| `dist/web-accessibility.min.js` | CSS ve fontları içeren, önerilen tek dosyalık üretim paketi |
| `dist/web-accessibility.js` | Okunabilir geliştirme çıktısı |
| `dist/web-accessibility.js.map` | Geliştirme kaynak haritası |
| `dist/web-accessibility.csp.min.js` | Haricî CSS kullanan sıkı CSP paketi |
| `dist/web-accessibility.css` | CSP paketinin stil dosyası |
| `dist/fonts/` | CSP paketinin OpenDyslexic fontları ve OFL lisansı |
| `dist/THIRD_PARTY_NOTICES.txt` | Font Awesome üçüncü taraf bildirimi |
| `dist/imu-web-accessibility-1.0.17.zip` | Kurulabilir WordPress eklentisi |

## Geliştirme ve test

```powershell
npm install
npm run build
npm run check
npm run test:e2e
```

Tüm kontrolleri tek komutla çalıştırmak için:

```powershell
npm test
```

Yerel demo:

```powershell
npm run serve
```

Ardından `http://127.0.0.1:4173/demo/` adresini açın. Farklı port için:

```powershell
node scripts/serve.mjs 4174
```

Test kapsamı:

- TypeScript tip kontrolü
- Dağıtım ve WordPress paket sözleşmesi testleri
- Klavye, ilk `Tab`, panel odağı, konum, tercih kalıcılığı ve sıfırlama testleri
- Araçların işlevsel durum testleri
- Sıkı CSP ve kendinden barındırılan font testleri
- 320 px mobil görünüm kontrolü
- axe-core ile ciddi/kritik otomatik erişilebilirlik taraması

## Lisanslar

- Ana JavaScript bileşeni: MIT, `LICENSE`
- WordPress entegrasyon kodu: GPL-2.0-or-later
- OpenDyslexic: SIL Open Font License 1.1, `dist/fonts/OFL.txt`
- Font Awesome Free 7.3.1 Universal Access ikonu: CC BY 4.0,
  `dist/THIRD_PARTY_NOTICES.txt`

