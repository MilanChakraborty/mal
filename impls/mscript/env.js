class Env {
  #outerEnvironment;
  data;
  #binds;
  #exprs;
  constructor(outer, binds, exprs) {
    this.#outerEnvironment = outer;
    this.data = { ...outer?.data } || {};
    this.#binds = binds || [];
    this.#exprs = exprs || [];
    this.#addBindings();
  }

  #addBindings() {
    for (const index in this.#binds) {
      this.data[this.#binds[index]] = this.#exprs[index];
    }
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
