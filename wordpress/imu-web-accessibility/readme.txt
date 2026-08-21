=== İMÜ Web Erişilebilirlik ===
Contributors: imu
Tags: accessibility, wcag, a11y, turkish, dyslexia
Requires at least: 5.8
Requires PHP: 7.4
Stable tag: 1.0.18
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Türkçe erişilebilirlik tercih araçlarını WordPress sitenize ekler.

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

Arayüz dili WordPress site dilinden otomatik algılanır. Site dili Türkçe ise
Türkçe, İngilizce ise İngilizce arayüz gösterilir. Henüz desteklenmeyen diğer
site dillerinde İngilizce kullanılır.

== Installation ==

1. ZIP dosyasını WordPress yönetiminde Eklentiler > Yeni Eklenti Ekle > Eklenti Yükle bölümünden yükleyin.
2. Eklentiyi etkinleştirin.
3. Ayarlar > Web Erişilebilirlik bölümünden düğme konumunu seçin.
4. Siteniz sıkı CSP kullanıyorsa aynı ekranda CSP modunu etkinleştirin.

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
* Widget arayüz dili WordPress site dilinden otomatik algılanır.
* Türkçe ve İngilizce yerel ayarları desteklenir; diğer diller İngilizceye döner.

= 1.0.17 =
* İlk WordPress eklenti paketi.
* Sol alt ve sağ alt konum ayarı.
* İsteğe bağlı sıkı CSP paketi.
