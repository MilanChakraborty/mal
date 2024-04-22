const { MalList, MalNil, MalValue, MalVector, MalMap } = require("./types");

class Reader {
  #tokens;
  #position;

  constructor(tokens) {
    this.#tokens = tokens;
    this.#position = 0;
  }

  peek() {
    return this.#tokens[this.#position];
  }

  next() {
    const currentToken = this.#tokens[this.#position];
    this.#position++;
    return currentToken;
  }
}

const read_seq = (reader, endSeq) => {
  const ast = [];

  while (reader.next()) {
    const currentToken = reader.peek();
    if (currentToken === endSeq) return ast;
    if (!currentToken) throw new Error("unbalanced");

    ast.push(read_form(reader));
  }
};

const read_atom = (reader) => {
  const token = reader.peek();
  return token === "nil" ? new MalNil() : new MalValue(token);
};

const read_form = (reader) => {
  const token = reader.peek();
  let ast;

  switch (token) {
    case "(":
      return new MalList(read_seq(reader, ")"));
    case "[":
      return new MalVector(read_seq(reader, "]"));
    case "{":
      return new MalMap(read_seq(reader, "}"));
    default:
      return read_atom(reader);
  }
};

const tokenize = (str) => {
  const regex =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  return [...str.matchAll(regex)].slice(0, -1).map((mtch) => mtch.at(1));
};

const read_str = (str) => {
  const tokens = tokenize(str);
  console.log(tokens)
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { Reader, read_str };
