const { createContext } = require("./context");

async function createPage(options = {}) {
    const context = await createContext(options);

    const page = await context.newPage();

    return {
        page,
        context,
    };
}

module.exports = {
    createPage,
};