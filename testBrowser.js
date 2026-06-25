const browser = require("./lib/browser/browser");

(async () => {
    const b = await browser.getBrowser();

    console.log("Connected:", b.isConnected());

    await browser.closeBrowser();
})();