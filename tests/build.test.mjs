import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");

test("dağıtım çıktıları oluşturulur", async () => {
  for (const file of [
    "web-accessibility.js",
    "web-accessibility.min.js",
    "web-accessibility.csp.min.js",
    "web-accessibility.css",
    "THIRD_PARTY_NOTICES.txt"
  ]) {
    const info = await stat(resolve(root, "dist", file));
    const minimumSize = file === "THIRD_PARTY_NOTICES.txt" ? 150 : 500;
    assert.ok(info.size > minimumSize, `${file} beklenenden küçük`);
  }
});

test("Font Awesome ikon atfı dağıtım paketinde korunur", async () => {
  const source = await readFile(resolve(root, "dist/web-accessibility.js"), "utf8");
  const notices = await readFile(resolve(root, "dist/THIRD_PARTY_NOTICES.txt"), "utf8");
  assert.match(source, /Font Awesome Free 7\.3\.1/);
  assert.match(notices, /Universal Access/);
  assert.match(notices, /Creative Commons Attribution 4\.0/);
  assert.match(notices, /Fonticons, Inc\./);
});

test("tek dosyalık paket otomatik başlatma ve genel API içerir", async () => {
  const source = await readFile(resolve(root, "dist/web-accessibility.js"), "utf8");
  assert.match(source, /WebAccessibility/);
  assert.match(source, /web-accessibility-widget/);
  assert.match(source, /speechSynthesis/);
  assert.match(source, /data-wa-highlight-links/);
  assert.match(source, /data:font\/woff2;base64,/);
});

test("CSP paketi OpenDyslexic fontlarını ve lisansını haricî dosya olarak içerir", async () => {
  const css = await readFile(resolve(root, "dist/web-accessibility.css"), "utf8");
  assert.match(css, /fonts\/opendyslexic-regular\.woff2/);
  assert.match(css, /fonts\/opendyslexic-bold\.woff2/);
  for (const file of ["opendyslexic-regular.woff2", "opendyslexic-bold.woff2", "OFL.txt"]) {
    const info = await stat(resolve(root, "dist/fonts", file));
    assert.ok(info.size > 500, `${file} beklenenden küçük`);
  }
});

test("üretim paketinde haricî takip veya CDN adresi bulunmaz", async () => {
  const source = await readFile(resolve(root, "dist/web-accessibility.min.js"), "utf8");
  assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/i);
  assert.doesNotMatch(source, /google-analytics|googletagmanager|facebook\.net/i);
});
