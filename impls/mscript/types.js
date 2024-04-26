class MalEnclosures {
  value;
  constructor(args) {
    this.value = args;
  }

  isEmpty() {
    return this.value.length === 0;
  }

  pr_str(start, end) {
    const elements = [...this.value].map((t) => t.pr_str()).join(" ");
    return `${start}${elements}${end}`;
  }

  equals(other) {
    return (
      other instanceof MalEnclosures &&
      this.value.length === other.value.length &&
      this.value.every((value, index) => value.equals(other.value[index]))
    );
  }
}

class MalType {
  value;
  constructor(value) {
    this.value = value;
  }

  pr_str(print_readably) {
    return print_readably === false
      ? this.value.slice(1, -1)
      : this.value.toString();
  }

  equals(other) {
    return this.value === other.value;
  }
}

class MalSymbol extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalBool extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalQuote {
  #form;
  constructor(form) {
    this.#form = form;
  }

  pr_str() {
    return `(quote ${this.#form.pr_str()})`;
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

class MalValue extends MalType {
  constructor(value) {
    super(+value);
  }
}

class MalFunction {
  constructor(body, env, binds) {
    this.body = body;
    this.env = env;
    this.binds = binds;
    this.value = this;
  }

  pr_str() {
    return "#<function>";
  }
}

class MalCoreFunction extends MalType {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return "#<function>";
  }
}

class MalString extends MalType {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably) {
    return super.pr_str(print_readably);
  }
}

class MalKeyword extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalNil {
  value;
  constructor() {
    this.value = false;
  }

  pr_str() {
    return "nil";
  }

  equals(other) {
    return other instanceof MalNil;
  }
}

module.exports = {
  MalList,
  MalNil,
  MalValue,
  MalVector,
  MalMap,
  MalQuote,
  MalBool,
  MalSymbol,
  MalEnclosures,
  MalFunction,
  MalString,
  MalKeyword,
  MalCoreFunction,
};
