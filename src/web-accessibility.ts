declare const __WA_EMBEDDED_CSS__: string;

type Position = "bottom-left" | "bottom-right" | "top-left" | "top-right";
type Language = "tr" | "en";
type ToggleKey =
  | "highlightLinks"
  | "hideImages"
  | "readableFont"
  | "highContrast"
  | "grayscale"
  | "largeCursor"
  | "stopAnimations"
  | "hoverRead"
  | "readingGuide";

interface AccessibilityState {
  highlightLinks: boolean;
  hideImages: boolean;
  textSize: number;
  lineSpacing: number;
  textAlign: number;
  readableFont: boolean;
  highContrast: boolean;
  grayscale: boolean;
  largeCursor: boolean;
  stopAnimations: boolean;
  hoverRead: boolean;
  readingGuide: boolean;
}

interface WidgetConfig {
  language: Language;
  position: Position;
  storageKey: string;
  styleUrl?: string;
}

interface ToolDefinition {
  action: string;
  label: string;
  icon: string;
}

interface WebAccessibilityApi {
  init(config?: Partial<WidgetConfig>): WebAccessibilityWidget;
  destroy(): void;
  getState(): AccessibilityState | null;
  reset(): void;
  setState(state: Partial<AccessibilityState>): void;
  version: string;
}

declare global {
  interface Window {
    WebAccessibility: WebAccessibilityApi;
  }
}

const VERSION = "1.0.18";
const EMBEDDED_STYLES = __WA_EMBEDDED_CSS__;
const TAG_NAME = "web-accessibility-widget";
const DOCUMENT_STYLE_ID = "imu-web-accessibility-styles";
const DEFAULT_STORAGE_KEY = "imu-web-accessibility:v1";
const bootScript = document.currentScript as HTMLScriptElement | null;

const DEFAULT_STATE: AccessibilityState = {
  highlightLinks: false,
  hideImages: false,
  textSize: 0,
  lineSpacing: 0,
  textAlign: 0,
  readableFont: false,
  highContrast: false,
  grayscale: false,
  largeCursor: false,
  stopAnimations: false,
  hoverRead: false,
  readingGuide: false
};

const COPY = {
  tr: {
    title: "Erişilebilirlik Araçları",
    open: "Erişilebilirlik araçları menüsünü aç",
    close: "Paneli kapat",
    reset: "Ayarları Sıfırla",
    resetDone: "Tüm erişilebilirlik tercihleri sıfırlandı.",
    active: "etkin",
    inactive: "kapalı",
    enabled: "etkinleştirildi",
    disabled: "kapatıldı",
    unavailableSpeech: "Bu tarayıcı sesli okuma özelliğini desteklemiyor.",
    noReadableText: "Okunabilecek metin bulunamadı.",
    readingStarted: "Sayfa okunmaya başladı.",
    readingStopped: "Sesli okuma durduruldu.",
    alignmentStates: ["varsayılan", "sola hizalı", "ortalanmış", "sağa hizalı"],
    tools: {
      highlightLinks: "Bağlantı Vurgula",
      hideImages: "Resimleri Gizle",
      textSize: "Büyük Metin",
      lineSpacing: "Satır Aralığı",
      textAlign: "Hizala",
      readableFont: "Disleksi Dostu",
      highContrast: "Kontrast",
      grayscale: "Gri Tonlama",
      largeCursor: "Büyük İmleç",
      stopAnimations: "Animasyonları Durdur",
      pageRead: "Sayfayı Oku",
      hoverRead: "Üzerine Gel Oku",
      readingGuide: "Okuma Kılavuzu"
    }
  },
  en: {
    title: "Accessibility Tools",
    open: "Open accessibility tools",
    close: "Close panel",
    reset: "Reset Settings",
    resetDone: "All accessibility preferences were reset.",
    active: "active",
    inactive: "off",
    enabled: "enabled",
    disabled: "disabled",
    unavailableSpeech: "This browser does not support text-to-speech.",
    noReadableText: "No readable text was found.",
    readingStarted: "Page reading started.",
    readingStopped: "Page reading stopped.",
    alignmentStates: ["default", "left aligned", "centered", "right aligned"],
    tools: {
      highlightLinks: "Highlight Links",
      hideImages: "Hide Images",
      textSize: "Larger Text",
      lineSpacing: "Line Spacing",
      textAlign: "Align",
      readableFont: "Readable Font",
      highContrast: "Contrast",
      grayscale: "Grayscale",
      largeCursor: "Large Cursor",
      stopAnimations: "Stop Animations",
      pageRead: "Read Page",
      hoverRead: "Read on Hover",
      readingGuide: "Reading Guide"
    }
  }
} as const;

const ICONS: Record<string, string> = {
  highlightLinks: '<svg viewBox="0 0 24 24"><path d="M10.6 13.4a4 4 0 0 0 5.7 0l2.1-2.1a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M13.4 10.6a4 4 0 0 0-5.7 0l-2.1 2.1a4 4 0 0 0 5.7 5.7l1.2-1.2"/></svg>',
  hideImages: '<svg viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M10.6 10.7a2 2 0 0 0 2.7 2.7"/><path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5 0 8.5 4 9.5 6.3a4 4 0 0 1 0 3.4c-.4.9-1.1 2-2.1 3"/><path d="M6.6 6.6A13 13 0 0 0 2.5 12a4 4 0 0 0 0 0c1 2.3 4.5 6 9.5 6 1.2 0 2.3-.2 3.3-.6"/></svg>',
  textSize: '<svg viewBox="0 0 24 24"><path d="M4 19l5-14 5 14M6 14h6"/><path d="M15 10h5m-2.5-2.5v5"/></svg>',
  lineSpacing: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 5v14m-2-2 2 2 2-2M1 7l2-2 2 2"/></svg>',
  textAlign: '<svg viewBox="0 0 24 24"><path d="M4 6h16M7 10h10M4 14h16M6 18h12"/></svg>',
  readableFont: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M12 7v10M9 17h6"/></svg>',
  highContrast: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path fill="currentColor" stroke="none" d="M12 3a9 9 0 0 1 0 18z"/></svg>',
  grayscale: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="9" r="1"/><circle cx="15" cy="15" r="1"/><circle cx="9" cy="15" r="1"/></svg>',
  largeCursor: '<svg viewBox="0 0 24 24"><path d="M5 3l13 8-6 2-3 6z"/></svg>',
  stopAnimations: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9v6M15 9v6"/></svg>',
  pageRead: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>',
  hoverRead: '<svg viewBox="0 0 24 24"><path d="M7 11V7a1.5 1.5 0 0 1 3 0v3-5a1.5 1.5 0 0 1 3 0v5-4a1.5 1.5 0 0 1 3 0v5-2a1.5 1.5 0 0 1 3 0v5c0 4-3 7-7 7h-1c-3 0-5-2-6-4l-2-4a1.5 1.5 0 0 1 2.6-1.5L7 13z"/></svg>',
  readingGuide: '<svg viewBox="0 0 24 24"><path d="M5 4v16M9 6h10M9 10h7M9 14h10M9 18h6"/><path d="M3 7h4M3 12h4M3 17h4"/></svg>',
  reset: '<svg viewBox="0 0 24 24"><path d="M4 7v5h5"/><path d="M5.5 17a8 8 0 1 0-.8-9L4 12"/></svg>',
  accessibility: '<svg class="wa-universal-access" viewBox="0 0 512 512"><!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0) Copyright 2026 Fonticons, Inc. --><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm161.5-86.1c-12.2-5.2-26.3 .4-31.5 12.6s.4 26.3 12.6 31.5l11.9 5.1c17.3 7.4 35.2 12.9 53.6 16.3l0 50.1c0 4.3-.7 8.6-2.1 12.6l-28.7 86.1c-4.2 12.6 2.6 26.2 15.2 30.4s26.2-2.6 30.4-15.2l24.4-73.2c1.3-3.8 4.8-6.4 8.8-6.4s7.6 2.6 8.8 6.4l24.4 73.2c4.2 12.6 17.8 19.4 30.4 15.2S339 397 334.8 384.4l-28.7-86.1c-1.4-4.1-2.1-8.3-2.1-12.6l0-50.1c18.4-3.5 36.3-8.9 53.6-16.3l11.9-5.1c12.2-5.2 17.8-19.3 12.6-31.5s-19.3-17.8-31.5-12.6L338.7 175c-26.1 11.2-54.2 17-82.7 17s-56.5-5.8-82.7-17l-11.9-5.1zM256 160a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>'
};

function safeState(input: unknown): AccessibilityState {
  const candidate = typeof input === "object" && input ? input as Partial<AccessibilityState> : {};
  const booleanKeys: ToggleKey[] = [
    "highlightLinks", "hideImages", "readableFont", "highContrast",
    "grayscale", "largeCursor", "stopAnimations", "hoverRead", "readingGuide"
  ];
  const output = { ...DEFAULT_STATE };
  for (const key of booleanKeys) output[key] = candidate[key] === true;
  output.textSize = Number.isInteger(candidate.textSize) ? Math.max(0, Math.min(3, Number(candidate.textSize))) : 0;
  output.lineSpacing = Number.isInteger(candidate.lineSpacing) ? Math.max(0, Math.min(3, Number(candidate.lineSpacing))) : 0;
  output.textAlign = Number.isInteger(candidate.textAlign)
    ? Math.max(0, Math.min(3, Number(candidate.textAlign)))
    : (candidate as { alignLeft?: unknown }).alignLeft === true ? 1 : 0;
  return output;
}

function deriveStyleUrl(src?: string): string | undefined {
  if (!src) return undefined;
  try {
    return new URL("web-accessibility.css", new URL(src, window.location.href)).href;
  } catch {
    return undefined;
  }
}

class WebAccessibilityWidget extends HTMLElement {
  private config: WidgetConfig = {
    language: "tr",
    position: "bottom-left",
    storageKey: DEFAULT_STORAGE_KEY
  };
  private state: AccessibilityState = { ...DEFAULT_STATE };
  private readonly shadow: ShadowRoot;
  private dialog!: HTMLDialogElement;
  private trigger!: HTMLButtonElement;
  private status!: HTMLElement;
  private guide!: HTMLElement;
  private connected = false;
  private initialTabHandled = false;
  private isReading = false;
  private speechQueue: string[] = [];
  private lastHoverElement: Element | null = null;

  private readonly onShadowClick = (event: Event): void => {
    const target = event.target as Element | null;
    const button = target?.closest<HTMLButtonElement>("button[data-action]");
    if (!button) return;
    this.handleAction(button.dataset.action || "");
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.state.readingGuide) return;
    this.guide.style.transform = `translateY(${Math.max(0, event.clientY - 22)}px)`;
  };

  private readonly onFocusMove = (event: FocusEvent): void => {
    if (!this.state.readingGuide || !(event.target instanceof HTMLElement)) return;
    const rect = event.target.getBoundingClientRect();
    if (rect.height > 0) this.guide.style.transform = `translateY(${Math.max(0, rect.top + rect.height / 2 - 22)}px)`;
  };

  private readonly onHover = (event: Event): void => {
    if (!this.state.hoverRead || this.isReading || !(event.target instanceof Element)) return;
    const readable = event.target.closest("h1,h2,h3,h4,h5,h6,p,li,a,button,label,td,th,figcaption,blockquote");
    if (!readable || readable === this.lastHoverElement || readable.closest(TAG_NAME)) return;
    const text = (readable as HTMLElement).innerText?.trim();
    if (!text || text.length > 500) return;
    this.lastHoverElement = readable;
    this.speakText(text);
  };

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.dialog.open) {
      event.preventDefault();
      this.closePanel();
    }
  };

  private readonly onInitialTab = (event: KeyboardEvent): void => {
    if (
      this.initialTabHandled ||
      event.key !== "Tab" ||
      event.shiftKey ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      this.dialog.open
    ) return;
    const active = document.activeElement;
    if (active && active !== document.body && active !== document.documentElement) return;
    this.initialTabHandled = true;
    event.preventDefault();
    this.openPanel();
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback(): void {
    if (this.connected) return;
    this.connected = true;
    this.setAttribute("data-wa-root", "");
    this.loadState();
    this.attachStyles();
    this.setAttribute("data-position", this.config.position);
    this.shadow.addEventListener("click", this.onShadowClick);
    document.addEventListener("keydown", this.onInitialTab);
    this.dialog.addEventListener("cancel", () => this.closePanel());
    this.dialog.addEventListener("close", () => {
      document.removeEventListener("keydown", this.onDocumentKeydown);
      this.trigger.setAttribute("aria-expanded", "false");
      this.trigger.focus({ preventScroll: true });
    });
    this.dialog.addEventListener("click", (event) => {
      if (event.target === this.dialog) this.closePanel();
    });
    this.applyState(false);
  }

  disconnectedCallback(): void {
    if (!this.connected) return;
    this.connected = false;
    this.shadow.removeEventListener("click", this.onShadowClick);
    document.removeEventListener("keydown", this.onInitialTab);
    document.removeEventListener("keydown", this.onDocumentKeydown);
    this.removeDocumentListeners();
    this.stopReading(false);
    this.clearDocumentState();
  }

  configure(config: Partial<WidgetConfig>): void {
    if (config.language === "tr" || config.language === "en") this.config.language = config.language;
    if (["bottom-left", "bottom-right", "top-left", "top-right"].includes(config.position || "")) {
      this.config.position = config.position as Position;
    }
    if (config.storageKey?.trim()) this.config.storageKey = config.storageKey.trim();
    if (config.styleUrl?.trim()) this.config.styleUrl = config.styleUrl.trim();
    this.setAttribute("data-position", this.config.position);
    if (!this.connected) this.render();
  }

  getState(): AccessibilityState {
    return { ...this.state };
  }

  setState(next: Partial<AccessibilityState>): void {
    this.state = safeState({ ...this.state, ...next });
    this.applyState(true);
  }

  reset(): void {
    this.stopReading(false);
    this.state = { ...DEFAULT_STATE };
    this.applyState(true);
    this.announce(COPY[this.config.language].resetDone);
  }

  destroy(): void {
    this.remove();
  }

  private render(): void {
    const copy = COPY[this.config.language];
    const tools: ToolDefinition[] = [
      { action: "highlightLinks", label: copy.tools.highlightLinks, icon: ICONS.highlightLinks },
      { action: "hideImages", label: copy.tools.hideImages, icon: ICONS.hideImages },
      { action: "textSize", label: copy.tools.textSize, icon: ICONS.textSize },
      { action: "lineSpacing", label: copy.tools.lineSpacing, icon: ICONS.lineSpacing },
      { action: "textAlign", label: copy.tools.textAlign, icon: ICONS.textAlign },
      { action: "readableFont", label: copy.tools.readableFont, icon: ICONS.readableFont },
      { action: "highContrast", label: copy.tools.highContrast, icon: ICONS.highContrast },
      { action: "grayscale", label: copy.tools.grayscale, icon: ICONS.grayscale },
      { action: "largeCursor", label: copy.tools.largeCursor, icon: ICONS.largeCursor },
      { action: "stopAnimations", label: copy.tools.stopAnimations, icon: ICONS.stopAnimations },
      { action: "pageRead", label: copy.tools.pageRead, icon: ICONS.pageRead },
      { action: "hoverRead", label: copy.tools.hoverRead, icon: ICONS.hoverRead },
      { action: "readingGuide", label: copy.tools.readingGuide, icon: ICONS.readingGuide }
    ];
    const buttons = tools.map((tool) => `
      <button class="wa-tool" type="button" data-action="${tool.action}" aria-pressed="false">
        <span class="wa-icon" aria-hidden="true">${tool.icon}</span>
        <span class="wa-label">${tool.label}</span>
        <span class="wa-level" aria-hidden="true"></span>
      </button>`).join("");

    this.shadow.innerHTML = `
      <div class="wa-shell">
        <button class="wa-trigger" type="button" data-action="open" aria-label="${copy.open}" aria-expanded="false" aria-controls="wa-dialog">
          <span aria-hidden="true">${ICONS.accessibility}</span>
        </button>
        <dialog class="wa-dialog" id="wa-dialog" aria-labelledby="wa-title">
          <div class="wa-panel">
            <header class="wa-header">
              <div class="wa-title-group">
                <span class="wa-title-icon" aria-hidden="true">${ICONS.accessibility}</span>
                <strong id="wa-title" tabindex="-1">${copy.title}</strong>
              </div>
              <button class="wa-close" type="button" data-action="close" aria-label="${copy.close}">${ICONS.close}</button>
            </header>
            <div class="wa-grid">
              ${buttons}
              <button class="wa-reset" type="button" data-action="reset">
                <span class="wa-icon" aria-hidden="true">${ICONS.reset}</span>
                <span>${copy.reset}</span>
              </button>
            </div>
          </div>
        </dialog>
        <div class="wa-reading-guide" aria-hidden="true"></div>
        <div class="wa-sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
      </div>`;

    this.dialog = this.shadow.querySelector<HTMLDialogElement>(".wa-dialog")!;
    this.trigger = this.shadow.querySelector<HTMLButtonElement>(".wa-trigger")!;
    this.status = this.shadow.querySelector<HTMLElement>("[role=status]")!;
    this.guide = this.shadow.querySelector<HTMLElement>(".wa-reading-guide")!;
  }

  private attachStyles(): void {
    const styleUrl = this.config.styleUrl || deriveStyleUrl(bootScript?.src);
    if (!document.getElementById(DOCUMENT_STYLE_ID)) {
      if (EMBEDDED_STYLES) {
        const style = document.createElement("style");
        style.id = DOCUMENT_STYLE_ID;
        style.textContent = EMBEDDED_STYLES;
        document.head.append(style);
      } else if (styleUrl) {
        const link = document.createElement("link");
        link.id = DOCUMENT_STYLE_ID;
        link.rel = "stylesheet";
        link.href = styleUrl;
        document.head.append(link);
      }
    }
    if (!this.shadow.querySelector("[data-wa-shadow-style]")) {
      if (EMBEDDED_STYLES) {
        const style = document.createElement("style");
        style.dataset.waShadowStyle = "";
        style.textContent = EMBEDDED_STYLES;
        this.shadow.prepend(style);
      } else if (styleUrl) {
        const link = document.createElement("link");
        link.dataset.waShadowStyle = "";
        link.rel = "stylesheet";
        link.href = styleUrl;
        this.shadow.prepend(link);
      }
    }
  }

  private handleAction(action: string): void {
    if (action === "open") return this.openPanel();
    if (action === "close") return this.closePanel();
    if (action === "reset") return this.reset();
    if (action === "pageRead") {
      if (this.isReading) this.stopReading(true);
      else this.startReading();
      return;
    }
    if (action === "textSize" || action === "lineSpacing" || action === "textAlign") {
      this.state[action] = (this.state[action] + 1) % 4;
      this.applyState(true);
      this.announceLevel(action);
      return;
    }
    if (action in this.state) {
      const key = action as ToggleKey;
      this.state[key] = !this.state[key];
      this.applyState(true);
      const copy = COPY[this.config.language];
      const label = copy.tools[key];
      this.announce(`${label} ${this.state[key] ? copy.enabled : copy.disabled}.`);
    }
  }

  private openPanel(): void {
    if (this.dialog.open) return;
    this.initialTabHandled = true;
    this.trigger.setAttribute("aria-expanded", "true");
    this.dialog.show();
    document.addEventListener("keydown", this.onDocumentKeydown);
    requestAnimationFrame(() => this.shadow.querySelector<HTMLElement>("#wa-title")?.focus({ preventScroll: true }));
  }

  private closePanel(): void {
    if (this.dialog.open) this.dialog.close();
  }

  private applyState(persist: boolean): void {
    const root = document.documentElement;
    const attributes: Record<string, boolean | number> = {
      "data-wa-highlight-links": this.state.highlightLinks,
      "data-wa-hide-images": this.state.hideImages,
      "data-wa-text-size": this.state.textSize,
      "data-wa-line-spacing": this.state.lineSpacing,
      "data-wa-text-align": this.state.textAlign,
      "data-wa-readable-font": this.state.readableFont,
      "data-wa-high-contrast": this.state.highContrast,
      "data-wa-grayscale": this.state.grayscale,
      "data-wa-large-cursor": this.state.largeCursor,
      "data-wa-stop-animations": this.state.stopAnimations
    };
    root.removeAttribute("data-wa-align-left");
    for (const [name, value] of Object.entries(attributes)) {
      if (value === false || value === 0) root.removeAttribute(name);
      else root.setAttribute(name, String(value));
    }
    this.guide.hidden = !this.state.readingGuide;
    this.syncDocumentListeners();
    this.updateButtons();
    if (persist) this.persistState();
    window.dispatchEvent(new CustomEvent("web-accessibility:change", { detail: this.getState() }));
  }

  private updateButtons(): void {
    const copy = COPY[this.config.language];
    for (const button of this.shadow.querySelectorAll<HTMLButtonElement>(".wa-tool")) {
      const action = button.dataset.action || "";
      let active = false;
      let level = 0;
      if (action === "pageRead") active = this.isReading;
      else if (action === "textSize" || action === "lineSpacing" || action === "textAlign") {
        level = this.state[action];
        active = level > 0;
      } else if (action in this.state) active = Boolean(this.state[action as keyof AccessibilityState]);
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("is-active", active);
      const badge = button.querySelector<HTMLElement>(".wa-level");
      if (badge) badge.textContent = level ? String(level) : "";
      const label = button.querySelector<HTMLElement>(".wa-label")?.textContent || "";
      const stateLabel = action === "textAlign"
        ? copy.alignmentStates[level as 0 | 1 | 2 | 3]
        : level ? `${copy.active}, ${level}/3` : active ? copy.active : copy.inactive;
      button.setAttribute("aria-label", `${label}: ${stateLabel}`);
    }
  }

  private announceLevel(action: "textSize" | "lineSpacing" | "textAlign"): void {
    const copy = COPY[this.config.language];
    const label = copy.tools[action];
    const level = this.state[action];
    if (action === "textAlign") {
      this.announce(`${label}: ${copy.alignmentStates[level as 0 | 1 | 2 | 3]}.`);
      return;
    }
    this.announce(level ? `${label} ${level}/3 ${copy.enabled}.` : `${label} ${copy.disabled}.`);
  }

  private announce(message: string): void {
    this.status.textContent = "";
    requestAnimationFrame(() => { this.status.textContent = message; });
  }

  private syncDocumentListeners(): void {
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("focusin", this.onFocusMove);
    document.removeEventListener("mouseover", this.onHover);
    if (this.state.readingGuide) {
      document.addEventListener("pointermove", this.onPointerMove, { passive: true });
      document.addEventListener("focusin", this.onFocusMove);
    }
    if (this.state.hoverRead) document.addEventListener("mouseover", this.onHover, { passive: true });
  }

  private removeDocumentListeners(): void {
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("focusin", this.onFocusMove);
    document.removeEventListener("mouseover", this.onHover);
  }

  private collectReadableText(): string {
    const container = document.querySelector<HTMLElement>("main,[role=main]") || document.body;
    const blocks = Array.from(container.querySelectorAll<HTMLElement>(
      "h1,h2,h3,h4,h5,h6,p,li,td,th,figcaption,blockquote"
    ));
    const seen = new Set<string>();
    const text: string[] = [];
    for (const block of blocks) {
      if (block.closest(TAG_NAME) || block.closest("[aria-hidden=true]")) continue;
      const style = getComputedStyle(block);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const value = block.innerText.replace(/\s+/g, " ").trim();
      if (value && !seen.has(value)) {
        seen.add(value);
        text.push(value);
      }
    }
    return text.join(". ");
  }

  private speechSupported(): boolean {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  private splitSpeech(text: string): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const chunks: string[] = [];
    let current = "";
    for (const sentence of sentences) {
      const clean = sentence.trim();
      if (!clean) continue;
      if (`${current} ${clean}`.trim().length > 220 && current) {
        chunks.push(current);
        current = clean;
      } else current = `${current} ${clean}`.trim();
    }
    if (current) chunks.push(current);
    return chunks;
  }

  private startReading(): void {
    const copy = COPY[this.config.language];
    if (!this.speechSupported()) return this.announce(copy.unavailableSpeech);
    const text = this.collectReadableText();
    if (!text) return this.announce(copy.noReadableText);
    window.speechSynthesis.cancel();
    this.speechQueue = this.splitSpeech(text);
    this.isReading = true;
    this.updateButtons();
    this.announce(copy.readingStarted);
    this.speakNextChunk();
  }

  private speakNextChunk(): void {
    if (!this.isReading || !this.speechQueue.length) {
      this.isReading = false;
      this.updateButtons();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(this.speechQueue.shift());
    utterance.lang = this.config.language === "tr" ? "tr-TR" : "en-US";
    utterance.rate = 0.95;
    utterance.onend = () => this.speakNextChunk();
    utterance.onerror = () => {
      this.isReading = false;
      this.speechQueue = [];
      this.updateButtons();
    };
    window.speechSynthesis.speak(utterance);
  }

  private speakText(text: string): void {
    if (!this.speechSupported()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.config.language === "tr" ? "tr-TR" : "en-US";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  private stopReading(announce: boolean): void {
    if (this.speechSupported()) window.speechSynthesis.cancel();
    this.speechQueue = [];
    const wasReading = this.isReading;
    this.isReading = false;
    if (this.status) this.updateButtons();
    if (announce && wasReading) this.announce(COPY[this.config.language].readingStopped);
  }

  private persistState(): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
    } catch {
      // Depolamanın kapalı olması aracın çalışmasını engellememelidir.
    }
  }

  private loadState(): void {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      this.state = saved ? safeState(JSON.parse(saved)) : { ...DEFAULT_STATE };
    } catch {
      this.state = { ...DEFAULT_STATE };
    }
  }

  private clearDocumentState(): void {
    for (const name of [
      "data-wa-highlight-links", "data-wa-hide-images", "data-wa-text-size",
      "data-wa-line-spacing", "data-wa-align-left", "data-wa-text-align", "data-wa-readable-font",
      "data-wa-high-contrast", "data-wa-grayscale", "data-wa-large-cursor",
      "data-wa-stop-animations"
    ]) document.documentElement.removeAttribute(name);
  }
}

if (!customElements.get(TAG_NAME)) customElements.define(TAG_NAME, WebAccessibilityWidget);

function currentWidget(): WebAccessibilityWidget | null {
  return document.querySelector<WebAccessibilityWidget>(TAG_NAME);
}

const api: WebAccessibilityApi = {
  version: VERSION,
  init(config = {}) {
    const existing = currentWidget();
    if (existing) {
      existing.configure(config);
      return existing;
    }
    const widget = document.createElement(TAG_NAME) as WebAccessibilityWidget;
    widget.configure(config);
    document.body.append(widget);
    return widget;
  },
  destroy() { currentWidget()?.destroy(); },
  getState() { return currentWidget()?.getState() || null; },
  reset() { currentWidget()?.reset(); },
  setState(state) { currentWidget()?.setState(state); }
};

window.WebAccessibility = api;

function boot(): void {
  if (bootScript?.dataset.waAuto === "false") return;
  const position = bootScript?.dataset.position as Position | undefined;
  const language = bootScript?.dataset.language as Language | undefined;
  api.init({
    position,
    language,
    storageKey: bootScript?.dataset.waStorage,
    styleUrl: bootScript?.dataset.waCss
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
else boot();

export { WebAccessibilityWidget };
