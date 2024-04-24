class Env {
  #outerEnvironment;
  data;
  constructor(outer) {
    this.#outerEnvironment = outer;
    this.data = { ...outer?.data } || {};
  }

  setBinding(symbol, value) {
    this.data[symbol] = value;
  }

  find(symbol) {
    return this.data[symbol] ? this : this.#outerEnvironment?.find(symbol);
  }

  get(symbol) {
    const env = this.find(symbol);
    const value = env?.data[symbol];
    if (value === undefined) throw new Error(symbol + " not found");

    return value;
  }
}

module.exports = { Env };
