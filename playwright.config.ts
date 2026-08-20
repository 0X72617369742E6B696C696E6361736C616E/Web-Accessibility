import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    channel: process.env.BROWSER_CHANNEL || (process.platform === "win32" ? "msedge" : undefined),
    headless: true,
    viewport: { width: 1280, height: 800 }
  },
  webServer: {
    command: "node scripts/serve.mjs",
    url: "http://127.0.0.1:4173/demo/",
    reuseExistingServer: true,
    timeout: 20_000
  }
});
