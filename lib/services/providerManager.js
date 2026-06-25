class ProviderManager {
  constructor() {
    this.providers = [];
  }

  register(provider) {
    this.providers.push(provider);
  }

  async execute(location) {
    const results = {};

    const responses = await Promise.allSettled(
      this.providers.map(async (provider) => ({
        name: provider.name,
        result: await provider.scrape(location),
      }))
    );

    responses.forEach((response) => {
      if (response.status === "fulfilled") {
        results[response.value.name] = response.value.result;
      } else {
        console.error(response.reason);
      }
    });

    return results;
  }
}

module.exports = ProviderManager;