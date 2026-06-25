const browserManager = require("./browser");

async function createContext(options = {}) {
    const browser = await browserManager.getBrowser();

    return browser.newContext({
        userAgent:
            options.userAgent ||
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",

        geolocation: options.geolocation,

        permissions: options.permissions || ["geolocation"],

        extraHTTPHeaders:
            options.extraHTTPHeaders || {
                "Accept-Language": "en-IN,en;q=0.9",
            },
    });
}

module.exports = {
    createContext,
};