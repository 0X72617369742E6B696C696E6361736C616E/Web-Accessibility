import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const widget = (page: import("@playwright/test").Page) => page.locator("web-accessibility-widget");

test.beforeEach(async ({ page }) => {
  await page.goto("/demo/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("sayfadaki ilk Tab erişilebilirlik panelini açar", async ({ page }) => {
  const root = widget(page);
  const dialog = root.getByRole("dialog", { name: "Erişilebilirlik Araçları" });
  const trigger = root.getByRole("button", { name: /erişilebilirlik araçları menüsünü aç/i });

  await expect(dialog).not.toBeVisible();
  await page.keyboard.press("Tab");
  await expect(dialog).toBeVisible();
  await expect(root.locator("#wa-title")).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog).not.toBeVisible();
});

test("panel erişilebilir adla açılır ve odağı yönetir", async ({ page }) => {
  const root = widget(page);
  const trigger = root.getByRole("button", { name: /erişilebilirlik araçları menüsünü aç/i });
  await expect(trigger).toBeVisible();
  await trigger.click();

  const dialog = root.getByRole("dialog", { name: "Erişilebilirlik Araçları" });
  await expect(dialog).toBeVisible();
  await expect(root.locator("#wa-title")).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("panel başlığında dekoratif erişilebilirlik ikonu gösterilir", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  const titleIcon = root.locator(".wa-title-icon");

  await expect(titleIcon).toBeVisible();
  await expect(titleIcon).toHaveAttribute("aria-hidden", "true");
  await expect(titleIcon).toHaveCSS("background-color", "rgb(255, 223, 0)");
  await expect(titleIcon.locator("svg")).toHaveAttribute("viewBox", "0 0 512 512");
  await expect(root.getByRole("dialog")).toHaveAccessibleName("Erişilebilirlik Araçları");
});

test("panel zemini açık gri ve araç düğmeleri beyazdır", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  await expect(root.locator(".wa-panel")).toHaveCSS("background-color", "rgb(242, 242, 242)");
  await expect(root.locator(".wa-tool").first()).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(root.locator(".wa-reset")).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("çekmece sayfadan hafif kenar gölgesiyle ayrılır", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  await expect(root.getByRole("dialog")).toHaveCSS("box-shadow", "rgba(15, 23, 42, 0.16) 7px 0px 18px 0px");
  await expect(root.locator(".wa-panel")).toHaveCSS("border-right-color", "rgb(213, 217, 223)");
});

test("panel soldan tam boy çekmece olarak açılır ve arka planı karartmaz", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  const dialog = root.getByRole("dialog");
  await page.waitForTimeout(220);
  const box = await dialog.boundingBox();
  const viewportHeight = await page.evaluate(() => window.innerHeight);

  expect(box).not.toBeNull();
  expect(box!.x).toBe(0);
  expect(box!.y).toBe(0);
  expect(box!.width).toBe(380);
  expect(box!.height).toBe(viewportHeight);
  await expect(root.locator(".wa-overlay")).toHaveCount(0);
  await expect(page.locator("body")).toHaveCSS("filter", "none");

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("tercihler uygulanır, saklanır ve sıfırlanır", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  await root.getByRole("button", { name: /bağlantı vurgula/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-wa-highlight-links", "true");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-wa-highlight-links", "true");
  await widget(page).getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  await widget(page).getByRole("button", { name: /ayarları sıfırla/i }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-wa-highlight-links");
  await expect.poll(() => page.evaluate(() => window.WebAccessibility.getState()?.highlightLinks)).toBe(false);
});

test("metin büyüklüğü üç kademe arasında döner", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  const textButton = root.getByRole("button", { name: /büyük metin/i });
  await textButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-wa-text-size", "1");
  await textButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-wa-text-size", "2");
  await textButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-wa-text-size", "3");
  await textButton.click();
  await expect(page.locator("html")).not.toHaveAttribute("data-wa-text-size");
});

test("hizalama sola, ortaya ve sağa döner; sonra varsayılana geçer", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  const alignButton = root.getByRole("button", { name: /^hizala/i });
  const heading = page.locator("h1");

  await alignButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-wa-text-align", "1");
  await expect(heading).toHaveCSS("text-align", "left");
  await expect(alignButton).toHaveAttribute("aria-label", "Hizala: sola hizalı");

  await alignButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-wa-text-align", "2");
  await expect(heading).toHaveCSS("text-align", "center");

  await alignButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-wa-text-align", "3");
  await expect(heading).toHaveCSS("text-align", "right");

  await alignButton.click();
  await expect(page.locator("html")).not.toHaveAttribute("data-wa-text-align");
  await expect.poll(() => page.evaluate(() => window.WebAccessibility.getState()?.textAlign)).toBe(0);
});

test("görsel, hareket ve okuma tercihleri işlevsel durum üretir", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();

  for (const name of [
    /resimleri gizle/i,
    /^hizala/i,
    /disleksi dostu/i,
    /^kontrast/i,
    /gri tonlama/i,
    /Büyük İmleç/,
    /animasyonları durdur/i,
    /üzerine gel oku/i,
    /okuma kılavuzu/i
  ]) {
    const button = root.getByRole("button", { name });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
  }

  await root.getByRole("button", { name: /satır aralığı/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-wa-line-spacing", "1");
  await expect(page.locator("article img").first()).toHaveCSS("opacity", "0");
  await expect(page.locator("html")).toHaveAttribute("data-wa-stop-animations", "true");
  await expect(page.locator("h1")).toHaveCSS("font-family", /OpenDyslexic/);
  await expect.poll(() => page.evaluate(() => document.fonts.check('16px "OpenDyslexic"'))).toBe(true);
  await expect.poll(() => page.evaluate(() => window.WebAccessibility.getState()?.readingGuide)).toBe(true);
});

test("sayfayı okuma düğmesi başlatma ve durdurma durumunu bildirir", async ({ page }) => {
  await page.evaluate(() => {
    window.speechSynthesis.speak = () => undefined;
    window.speechSynthesis.cancel = () => undefined;
  });
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  const readButton = root.getByRole("button", { name: /sayfayı oku/i });
  await readButton.click();
  await expect(readButton).toHaveAttribute("aria-pressed", "true");
  await readButton.click();
  await expect(readButton).toHaveAttribute("aria-pressed", "false");
});

test("GTranslate hedef dili paneli ve sesli okumayı sayfa yenilenmeden günceller", async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "googtrans=; Max-Age=0; path=/";
    const testWindow = window as unknown as { __spokenLanguages: string[] };
    testWindow.__spokenLanguages = [];
    window.speechSynthesis.speak = (utterance) => { testWindow.__spokenLanguages.push(utterance.lang); };
    window.speechSynthesis.cancel = () => undefined;
    window.WebAccessibility.init({ gtranslate: true });

    const english = document.createElement("button");
    english.id = "test-gtranslate-en";
    english.dataset.gtLang = "en";
    english.textContent = "English";
    document.body.append(english);
  });

  await page.locator("#test-gtranslate-en").click();
  const root = widget(page);
  await expect(root.getByRole("button", { name: /open accessibility tools/i })).toBeVisible();
  await root.getByRole("button", { name: /open accessibility tools/i }).click();
  await expect(root.getByRole("dialog")).toHaveAccessibleName("Accessibility Tools");
  await root.getByRole("button", { name: /read page/i }).click();
  await expect.poll(() => page.evaluate(() => (
    window as unknown as { __spokenLanguages: string[] }
  ).__spokenLanguages)).toContain("en-US");

  await page.evaluate(() => {
    document.cookie = "googtrans=; Max-Age=0; path=/";
    window.WebAccessibility.init({ gtranslate: false, language: "tr" });
  });
});

test("panel açıkken arka plan etkileşimli kalır ve üzerine gelinen metin okunur", async ({ page }) => {
  await page.evaluate(() => {
    const testWindow = window as unknown as { __spoken: string[] };
    testWindow.__spoken = [];
    window.speechSynthesis.speak = (utterance) => { testWindow.__spoken.push(utterance.text); };
    window.speechSynthesis.cancel = () => undefined;
  });
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  await root.getByRole("button", { name: /üzerine gel oku/i }).click();

  const paragraph = page.locator(".intro p");
  await paragraph.hover();
  await expect.poll(() => page.evaluate(() => (
    window as unknown as { __spoken: string[] }
  ).__spoken.join(" "))).toContain("Bu demo");

  await page.getByRole("link", { name: "Kategoriler" }).click();
  await expect(page).toHaveURL(/#kategoriler$/);
  await expect(root.getByRole("dialog")).toBeVisible();
});

test("mobil görünümde panel ekran dışına taşmaz", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  await page.waitForTimeout(220);
  const box = await root.getByRole("dialog").boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  expect(box!.y + box!.height).toBeLessThanOrEqual(640);
});

test("yatay flex body içinde sabit düğme görünür alanda kalır", async ({ page }) => {
  await page.evaluate(() => {
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
  });
  const trigger = widget(page).getByRole("button", { name: /erişilebilirlik araçları/i });
  const box = await trigger.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
  expect(box!.x).toBeLessThan(100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
});

test("açma ikonu sarı zemin ve siyah çizgiler kullanır", async ({ page }) => {
  const trigger = widget(page).getByRole("button", { name: /erişilebilirlik araçları/i });
  await expect(trigger).toHaveCSS("background-color", "rgb(255, 223, 0)");
  await expect(trigger).toHaveCSS("border-color", "rgb(17, 17, 17)");
  await expect(trigger).toHaveCSS("color", "rgb(17, 17, 17)");
  await expect(trigger).toHaveCSS("width", "46px");
  await expect(trigger).toHaveCSS("height", "46px");
  await expect(trigger.locator("svg")).toHaveAttribute("viewBox", "0 0 512 512");
  await expect(trigger.locator("svg path")).toHaveAttribute("fill", "currentColor");
  await expect(trigger.locator("svg path")).toHaveCSS("stroke", "none");
  const centers = await trigger.evaluate((button) => {
    const buttonBox = button.getBoundingClientRect();
    const svgBox = button.querySelector("svg")!.getBoundingClientRect();
    return {
      horizontal: Math.abs((buttonBox.left + buttonBox.width / 2) - (svgBox.left + svgBox.width / 2)),
      vertical: Math.abs((buttonBox.top + buttonBox.height / 2) - (svgBox.top + svgBox.height / 2))
    };
  });
  expect(centers.horizontal).toBeLessThan(0.1);
  expect(centers.vertical).toBeLessThan(0.1);
});

test("sıfırlama düğmesi son boş grid hücresini kullanır ve panel yazısı kompaktır", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  const grid = root.locator(".wa-grid");
  const reset = grid.locator(":scope > .wa-reset");
  await expect(grid.locator(":scope > button")).toHaveCount(14);
  await expect(reset).toBeVisible();
  await expect(root.locator(".wa-tool").first()).toHaveCSS("font-size", "13px");
});

test("okuma kılavuzu sarı şerit ve kırmızı sınırlarla gösterilir", async ({ page }) => {
  const root = widget(page);
  await root.getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  const guideButton = root.getByRole("button", { name: /okuma kılavuzu/i });
  await guideButton.scrollIntoViewIfNeeded();
  await guideButton.click();
  const guide = root.locator(".wa-reading-guide");
  await expect(guide).toBeVisible();
  await expect(guide).toHaveCSS("background-color", "rgba(255, 255, 0, 0.35)");
  await expect(guide).toHaveCSS("border-top-color", "rgb(239, 0, 0)");
  await expect(guide).toHaveCSS("border-bottom-color", "rgb(239, 0, 0)");
});

test("demo ve açık panelde ciddi otomatik erişilebilirlik ihlali yoktur", async ({ page }) => {
  await widget(page).getByRole("button", { name: /erişilebilirlik araçları/i }).click();
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((item) => ["serious", "critical"].includes(item.impact || ""));
  expect(serious, serious.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
});

test("haricî CSS paketi sıkı CSP altında çalışır", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/demo/csp.html");
  const root = widget(page);
  const trigger = root.getByRole("button", { name: /erişilebilirlik araçları/i });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(root.getByRole("dialog")).toBeVisible();
  await root.getByRole("button", { name: /disleksi dostu/i }).click();
  await expect.poll(() => page.evaluate(() => document.fonts.check('16px "OpenDyslexic"'))).toBe(true);
  await expect(trigger).toHaveCSS("position", "fixed");
  await expect(trigger).toHaveCSS("width", "46px");
  expect(errors.filter((error) => /content security policy/i.test(error))).toEqual([]);
});
