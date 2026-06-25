const { chromium } = require("playwright-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

chromium.use(StealthPlugin());

class BrowserManager {
  constructor() {
    this.browser = null;
    this.launching = null;
  }

  async getBrowser() {
    // Already running
    if (this.browser && this.browser.isConnected()) {
      return this.browser;
    }

    // Prevent multiple launches
    if (this.launching) {
      return this.launching;
    }

    this.launching = chromium.launch({
      headless: process.env.HEADLESS !== "false",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    this.browser = await this.launching;
    this.launching = null;

    this.browser.on("disconnected", () => {
      console.log("[Browser] Disconnected");
      this.browser = null;
    });

    console.log("[Browser] Started");

    return this.browser;
  }

  async closeBrowser() {
    if (!this.browser) return;

    try {
      await this.browser.close();
    } catch (err) {
      console.error(err);
    }

    this.browser = null;
  }
}

module.exports = new BrowserManager();