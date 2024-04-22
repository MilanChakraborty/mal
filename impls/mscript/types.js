class MalEnclosures {
  #args;
  constructor(args) {
    this.#args = args;
  }

  pr_str(start, end) {
    const elements = [...this.#args].map((t) => t.pr_str()).join(" ");
    return `${start}${elements}${end}`;
  }
}

class MalList extends MalEnclosures {
  constructor(args) {
    super(args);
  }

  pr_str() {
    return super.pr_str("(", ")");
  }
}

class MalVector extends MalEnclosures {
  constructor(args) {
    super(args);
  }

  pr_str() {
    return super.pr_str("[", "]");
  }
}

class MalMap extends MalEnclosures {
  constructor(args) {
    super(args);
  }

  pr_str() {
    return super.pr_str("{", "}");
  }
}

class MalValue {
  #value;
  constructor(value) {
    this.#value = value;
  }

  pr_str() {
    return this.#value;
  }
}

class MalNil {
  pr_str() {
    return "nil";
  }
}

module.exports = { MalList, MalNil, MalValue, MalVector, MalMap };
