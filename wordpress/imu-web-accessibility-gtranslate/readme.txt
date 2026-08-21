=== İMÜ Web Erişilebilirlik – GTranslate ===
Contributors: imu
Tags: accessibility, wcag, a11y, gtranslate, dyslexia
Requires at least: 5.8
Requires PHP: 7.4
Stable tag: 1.0.18
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

GTranslate dil değişimini algılayan erişilebilirlik tercih araçlarını WordPress sitenize ekler.

== Description ==

İMÜ Web Erişilebilirlik; bağlantı vurgulama, görselleri gizleme, metin büyütme,
satır aralığı, metin hizalama, disleksi dostu yazı tipi, kontrast, gri tonlama,
büyük imleç, animasyonları durdurma, sayfayı okuma, üzerine gelerek okuma ve
okuma kılavuzu araçlarını sunar.

Panel, seçilen kenardan tam boy çekmece olarak açılır; arka planı karartmaz.
Sayfadaki ilk ileri Tab tuşu paneli açar ve Escape tuşu paneli kapatır.

Eklenti herhangi bir haricî CDN veya takip servisine bağlanmaz. Widget arayüzü
Shadow DOM içinde çalışır. Kullanıcı tercihleri tarayıcının localStorage alanında
saklanır.

Arayüz ve sesli okuma dili GTranslate seçimine göre sayfa yenilenmeden
güncellenir. Türkçe için tr-TR, İngilizce için en-US sesi kullanılır; diğer
GTranslate dillerinde seçilen hedef dil kodu ses motoruna aktarılır.

Dil algılama sırasında GTranslate seçim öğeleri, googtrans çerezi ve HTML lang
değeri birlikte değerlendirilir. Bu paket yalnızca GTranslate kullanılan
siteler içindir; aynı sitede standart paketle birlikte etkinleştirilmemelidir.

== Installation ==

1. ZIP dosyasını WordPress yönetiminde Eklentiler > Yeni Eklenti Ekle > Eklenti Yükle bölümünden yükleyin.
2. Standart sürüm kuruluysa WordPress'in mevcut eklentiyi değiştirme seçeneğini onaylayın.
3. Eklentiyi etkinleştirin.
4. Ayarlar > Web Erişilebilirlik bölümünden düğme konumunu seçin.
5. Siteniz sıkı CSP kullanıyorsa aynı ekranda CSP modunu etkinleştirin.

== Frequently Asked Questions ==

= Eklentiyi kullanmak sitemi otomatik olarak WCAG uyumlu yapar mı? =

Hayır. Araç kullanıcı tercihleri sağlar; içerik, tema, formlar, klavye dolaşımı,
alternatif metinler ve diğer WCAG gereklilikleri ayrıca denetlenmelidir.

= Hangi konumlar desteklenir? =

Sol alt ve sağ alt konumları yönetim ekranından seçilebilir.

= Bu araç siteyi otomatik olarak erişilebilir yapar mı? =

Hayır. Kullanıcı tercih araçları sunar. Tema, içerik, formlar, alternatif
metinler, klavye sırası ve ekran okuyucu davranışı ayrıca test edilmelidir.

= CSP modu ne işe yarar? =

CSS ve OpenDyslexic fontlarını haricî dosyalardan yükler. Inline stil ve data:
font kullanımını engelleyen Content Security Policy yapılandırmaları içindir.

== Changelog ==

= 1.0.18 =
* GTranslate hedef dili çalışma anında otomatik algılanır.
* Panel metinleri ve sesli okuma dili sayfa yenilenmeden güncellenir.
* Sayfayı Oku ve Üzerine Gel Oku seçilen GTranslate dilini kullanır.

= 1.0.17 =
* İlk WordPress eklenti paketi.
* Sol alt ve sağ alt konum ayarı.
* İsteğe bağlı sıkı CSP paketi.
