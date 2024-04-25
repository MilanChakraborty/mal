const { MalValue, MalBool, MalList, MalNil, MalString } = require("./types");
const { pr_str } = require("./printer");
const equals = ([a, b]) => a.equals(b);
const formatToPrint = (args, print_readably) =>
  args.map((arg) => arg.pr_str(print_readably)).join(" ") || "";

const prn = (...args) => {
  const toPrint = formatToPrint(args, true);
  pr_str(new MalString(toPrint));
  return new MalNil();
};

const println = (...args) => {
  const toPrint = formatToPrint(args, false);
  pr_str(new MalString(toPrint));
  return new MalNil();
};

const ns = {
  "+": (...args) => args.reduce((a, b) => new MalValue(a.value + b.value)),
  "-": (...args) => args.reduce((a, b) => new MalValue(a.value - b.value)),
  "*": (...args) => args.reduce((a, b) => new MalValue(a.value * b.value)),
  "/": (...args) => args.reduce((a, b) => new MalValue(a.value / b.value)),
  "<": (a, b) => new MalBool(a.value < b.value),
  "<=": (a, b) => new MalBool(a.value <= b.value),
  ">": (a, b) => new MalBool(a.value > b.value),
  ">=": (a, b) => new MalBool(a.value >= b.value),
  list: (...args) => new MalList(args),
  "list?": (a) => new MalBool(a instanceof MalList),
  "empty?": (a) => new MalBool(a.value.length === 0),
  count: (a) => new MalValue(a instanceof MalNil ? 0 : a.value.length),
  "=": (...args) => new MalBool(equals(args)),
  prn,
  println
};

module.exports = { ns };
