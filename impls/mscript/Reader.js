const {
  MalList,
  MalNil,
  MalValue,
  MalVector,
  MalMap,
  MalQuote,
  MalBool,
  MalSymbol,
} = require("./types");

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
  switch (true) {
    case token === "nil":
      return new MalNil();
    case token === "false":
      return new MalBool(false);
    case token === "true":
      return new MalBool(true);
    case /^[\Wa-zA-Z]+$/.test(token):
      return new MalSymbol(token);
    default:
      return new MalValue(token);
  }
};

const read_form = (reader) => {
  const token = reader.peek();

  switch (token) {
    case "(":
      return new MalList(read_seq(reader, ")"));
    case "[":
      return new MalVector(read_seq(reader, "]"));
    case "{":
      return new MalMap(read_seq(reader, "}"));
    case "'":
      reader.next();
      return new MalQuote(read_form(reader));
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
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { Reader, read_str };
