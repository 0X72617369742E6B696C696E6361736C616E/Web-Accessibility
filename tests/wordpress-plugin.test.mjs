import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const plugin = resolve(root, "wordpress/imu-web-accessibility");

test("WordPress eklenti paketi gerekli çalışma dosyalarını içerir", async () => {
  for (const file of [
    "imu-web-accessibility.php",
    "uninstall.php",
    "readme.txt",
    "assets/web-accessibility.min.js",
    "assets/web-accessibility.csp.min.js",
    "assets/web-accessibility.css",
    "assets/fonts/opendyslexic-regular.woff2",
    "assets/fonts/opendyslexic-bold.woff2",
    "licenses/OpenDyslexic-OFL.txt",
    "licenses/THIRD_PARTY_NOTICES.txt",
    "licenses/WebAccessibility-MIT.txt"
  ]) {
    const info = await stat(resolve(plugin, file));
    assert.ok(info.size > 100, `${file} eksik veya beklenenden küçük`);
  }
});

test("WordPress eklentisi konum ve CSP ayarlarını güvenli biçimde sınırlar", async () => {
  const php = await readFile(resolve(plugin, "imu-web-accessibility.php"), "utf8");
  assert.match(php, /Version:\s+1\.0\.18/);
  assert.match(php, /array\( 'bottom-left', 'bottom-right' \)/);
  assert.match(php, /sanitize_key/);
  assert.match(php, /data-position/);
  assert.match(php, /data-wa-css/);
  assert.match(php, /get_locale\(\)/);
  assert.match(php, /imu_wa_get_widget_language/);
  assert.match(php, /data-language="%s"/);
  assert.match(php, /current_user_can\( 'manage_options' \)/);
  assert.match(php, /settings_fields\( 'imu_web_accessibility' \)/);
});

test("WordPress varlıkları widget 1.0.18 sürümünü ve yerel CSP fontlarını kullanır", async () => {
  const standard = await readFile(resolve(plugin, "assets/web-accessibility.min.js"), "utf8");
  const csp = await readFile(resolve(plugin, "assets/web-accessibility.csp.min.js"), "utf8");
  const css = await readFile(resolve(plugin, "assets/web-accessibility.css"), "utf8");
  assert.match(standard, /IMU Web Accessibility v1\.0\.18/);
  assert.match(csp, /IMU Web Accessibility v1\.0\.18/);
  assert.match(css, /fonts\/opendyslexic-regular\.woff2/);
  assert.match(css, /fonts\/opendyslexic-bold\.woff2/);
});

test("ana README standart, CSP ve WordPress kurulumlarını belgeler", async () => {
  const readme = await readFile(resolve(root, "README.md"), "utf8");
  const pluginReadme = await readFile(resolve(plugin, "readme.txt"), "utf8");
  assert.match(readme, /Sürüm: 1\.0\.18/);
  assert.match(readme, /imu-web-accessibility-1\.0\.18\.zip/);
  assert.match(readme, /data-position="bottom-left"/);
  assert.match(readme, /data-position="bottom-right"/);
  assert.match(readme, /web-accessibility\.csp\.min\.js/);
  assert.match(readme, /`textAlign`/);
  assert.match(pluginReadme, /arka planı karartmaz/);
  assert.match(pluginReadme, /otomatik olarak erişilebilir yapar mı/);
  assert.match(pluginReadme, /site dilinden otomatik algılanır/);
});
