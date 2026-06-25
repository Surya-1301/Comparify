class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  success(data = {}) {
    return {
      provider: this.name,
      available: true,
      error: null,
      ...data,
    };
  }

  unavailable(message = "Unavailable") {
    return {
      provider: this.name,
      available: false,
      minutes: null,
      price: null,
      error: message,
    };
  }

  fail(error) {
    return {
      provider: this.name,
      available: false,
      minutes: null,
      price: null,
      error:
        error instanceof Error
          ? error.message
          : String(error),
    };
  }
}

module.exports = BaseProvider;