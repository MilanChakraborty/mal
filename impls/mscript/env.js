const { MalList } = require("./types");

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

  #isVariadic(bind) {
    return bind === "&";
  }

  #addBindings() {
    for (const index in this.#binds) {
      const bind = this.#binds[index];

      if (this.#isVariadic(bind)) {
        this.data[this.#binds[+index + 1]] = new MalList(
          this.#exprs.slice(+index)
        );
        break;
      }

      this.data[bind] = this.#exprs[index];
    }
  }

  setBinding(symbol, value) {
    this.data[symbol] = value;
  }

  find(symbol) {
    return this.data[symbol] ? this : this.#outerEnvironment?.find(symbol);
  }

  get(symbol) {
    const value = this.find(symbol)?.data[symbol];
    if (value === undefined) throw new Error(symbol + " not found");

    return value;
  }
}

module.exports = { Env };
