const { MalValue, MalBool, MalList, MalNil } = require("./types");



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
  "=": (a, b) => new MalBool(a.value === b.value),
};

module.exports = { ns };
