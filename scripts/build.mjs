import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const fontSource = resolve(root, "node_modules/@fontsource/opendyslexic");
const fontDist = resolve(dist, "fonts");
const cssTemplate = await readFile(resolve(root, "src/web-accessibility.css"), "utf8");
const regularFont = await readFile(resolve(fontSource, "files/opendyslexic-latin-400-normal.woff2"));
const boldFont = await readFile(resolve(fontSource, "files/opendyslexic-latin-700-normal.woff2"));
const embeddedCss = cssTemplate
  .replaceAll("__WA_FONT_REGULAR__", `data:font/woff2;base64,${regularFont.toString("base64")}`)
  .replaceAll("__WA_FONT_BOLD__", `data:font/woff2;base64,${boldFont.toString("base64")}`);
const externalCss = cssTemplate
  .replaceAll("__WA_FONT_REGULAR__", "fonts/opendyslexic-regular.woff2")
  .replaceAll("__WA_FONT_BOLD__", "fonts/opendyslexic-bold.woff2");
const banner = "/*! IMU Web Accessibility v1.0.17 | MIT License; includes Font Awesome Free icon under CC BY 4.0 */";

await mkdir(dist, { recursive: true });
await mkdir(fontDist, { recursive: true });
await writeFile(resolve(dist, "web-accessibility.css"), `${banner}\n${externalCss}`, "utf8");
await writeFile(resolve(fontDist, "opendyslexic-regular.woff2"), regularFont);
await writeFile(resolve(fontDist, "opendyslexic-bold.woff2"), boldFont);
await writeFile(resolve(fontDist, "OFL.txt"), await readFile(resolve(fontSource, "LICENSE")));
await writeFile(
  resolve(dist, "THIRD_PARTY_NOTICES.txt"),
  await readFile(resolve(root, "THIRD_PARTY_NOTICES.txt"))
);

const common = {
  entryPoints: [resolve(root, "src/web-accessibility.ts")],
  bundle: true,
  format: "iife",
  target: ["es2020"],
  legalComments: "none",
  banner: { js: banner }
};

await build({
  ...common,
  outfile: resolve(dist, "web-accessibility.js"),
  define: { __WA_EMBEDDED_CSS__: JSON.stringify(embeddedCss) },
  sourcemap: true
});

await build({
  ...common,
  outfile: resolve(dist, "web-accessibility.min.js"),
  define: { __WA_EMBEDDED_CSS__: JSON.stringify(embeddedCss) },
  minify: true
});

await build({
  ...common,
  outfile: resolve(dist, "web-accessibility.csp.min.js"),
  define: { __WA_EMBEDDED_CSS__: JSON.stringify("") },
  minify: true
});

console.log("Dağıtım dosyaları dist/ klasörüne oluşturuldu.");
