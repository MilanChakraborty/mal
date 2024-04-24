class Env {
  #outerEnvironment;
  bindings;
  constructor(outer) {
    this.#outerEnvironment = outer;
    this.bindings = { ...outer?.bindings } || {};
  }

  setBinding(symbol, value) {
    this.bindings[symbol] = value;
  }

  find(symbol) {
    return this.bindings[symbol] ? this : this.#outerEnvironment?.find(symbol);
  }

  get(symbol) {
    const env = this.find(symbol);
    const value = env?.bindings[symbol];
    if (value === undefined) throw new Error(symbol + " not found");

    return value;
  }
}

module.exports = { Env };
