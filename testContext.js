const { createPage } = require("./lib/browser/page");

(async () => {

    const { page, context } = await createPage();

    await page.goto("https://example.com");

    console.log(await page.title());

    await context.close();

})();