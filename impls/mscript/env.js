class Env {
  #outerEnvironment;
  data;
  binds;
  constructor(outer, binds) {
    this.#outerEnvironment = outer;
    this.data = { ...outer?.data } || {};
    this.binds = binds || [];
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

  createEnvWithBinds(binds) {
    return new Env(this, binds);
  }

  addMappingsForBinds(values) {
    for (const index in this.binds) {
      const bind = this.binds[index];
      this.data[bind] = values[index];
    }
  }
}

module.exports = { Env };
