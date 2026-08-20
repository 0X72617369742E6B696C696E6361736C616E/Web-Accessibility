# İMÜ Web Erişilebilirlik Araçları

Framework veya CMS bağımlılığı olmayan, Türkçe/İngilizce ve geri alınabilir kullanıcı tercihleri sunan erişilebilirlik bileşeni.

> Bu araç, kullanıcıların içeriği kendilerine uygun biçimde görüntülemesine yardımcı olur. Eksik alternatif metinleri, hatalı başlık sırasını, etiketsiz formları veya klavye tuzaklarını otomatik olarak düzeltmez. Bir sitenin WCAG uygunluğu sayfanın tamamı değerlendirilerek belirlenir.

## Hızlı entegrasyon

`dist/web-accessibility.min.js` dosyasını sitenize kopyalayın:

```html
<script src="/accessibility/web-accessibility.min.js" defer></script>
```

Varsayılan dil Türkçe, konum sol alttır. Veri nitelikleriyle değiştirilebilir:

```html
<script
  src="/accessibility/web-accessibility.min.js"
  data-language="tr"
  data-position="bottom-right"
  defer></script>
```

Geçerli konumlar: `bottom-left`, `bottom-right`, `top-left`, `top-right`.

## Sıkı CSP kullanımı

Inline stil kabul etmeyen sitelerde JS ve CSS dosyalarını birlikte barındırın:

```html
<link rel="stylesheet" href="/accessibility/web-accessibility.css">
<script
  src="/accessibility/web-accessibility.csp.min.js"
  data-wa-css="/accessibility/web-accessibility.css"
  defer></script>
```

CSS adresi verilmezse betik, kendisiyle aynı klasördeki `web-accessibility.css` dosyasını arar.

## Programatik kullanım

Otomatik başlatmayı kapatıp API üzerinden yapılandırabilirsiniz:

```html
<script src="/accessibility/web-accessibility.min.js" data-wa-auto="false" defer></script>
<script>
  window.addEventListener("DOMContentLoaded", () => {
    WebAccessibility.init({ language: "tr", position: "bottom-left" });
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

Tercih değiştiğinde `window` üzerinde `web-accessibility:change` olayı yayınlanır.

## Siteye özel istisnalar

- Gizlenmemesi gereken bir görsele `data-wa-keep-visible` ekleyin.
- Görsel niteliğindeki inline SVG öğelerine `data-wa-image` ekleyin.
- Eklenti arayüzü Shadow DOM içinde çalışır; site CSS'i paneli etkilemez.
- Yüksek kontrast modu genel bir güvenli varsayılan uygular. Kurumsal temada kritik özel bileşenler ayrıca test edilmelidir.
- “Disleksi Dostu” seçeneği, paket içinde kendinden barındırılan OpenDyslexic yazı tipine geçer; tıbbi fayda iddiası taşımaz.
- Sesli okuma, tarayıcının Web Speech API desteğine bağlıdır ve ekran okuyucunun yerine geçmez.

OpenDyslexic yazı tipi Abbie Gonzalez tarafından geliştirilmiştir ve SIL Open Font License 1.1 ile dağıtılır. CSP paketindeki lisans metni `dist/fonts/OFL.txt` dosyasındadır.

## Geliştirme

```powershell
npm install
npm run build
npm run check
npm run test:e2e
```

Demo:

```powershell
npm run serve
```

Ardından `http://127.0.0.1:4173/demo/` adresini açın.

## Dağıtım dosyaları

- `web-accessibility.min.js`: CSS'i içinde taşıyan tek dosyalık kurulum
- `web-accessibility.js`: okunabilir geliştirme çıktısı ve kaynak haritası
- `web-accessibility.csp.min.js`: haricî CSS kullanan sıkı CSP sürümü
- `web-accessibility.css`: CSP sürümünün stil dosyası

## Test kapsamı

- TypeScript tip kontrolü
- Dağıtım sözleşmesi testleri
- Klavye, dialog odağı, ayar kalıcılığı ve sıfırlama için Playwright testleri
- axe-core ile ciddi/kritik otomatik erişilebilirlik taraması
- 320 px mobil görünüm kontrolü

Otomatik testler erişilebilirlik uzmanı incelemesinin yerini tutmaz. Yayına alınacak her site, kendi içerik ve bileşenleriyle ayrıca klavye ve ekran okuyucu testinden geçirilmelidir.
