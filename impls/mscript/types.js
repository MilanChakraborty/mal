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
}

class MalType {
  value;
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalBool extends MalType {
  constructor(value) {
    super(value === "true");
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

class MalFunction extends MalType {
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
};
