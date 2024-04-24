const { MalValue, MalBool } = require("./types");

const ns = {
  "+": (...args) => args.reduce((a, b) => new MalValue(a.value + b.value)),
  "-": (...args) => args.reduce((a, b) => new MalValue(a.value - b.value)),
  "*": (...args) => args.reduce((a, b) => new MalValue(a.value * b.value)),
  "/": (...args) => args.reduce((a, b) => new MalValue(a.value / b.value)),
  "<": (a, b) => new MalBool((a.value < b.value).toString()),
  "<=": (a, b) => new MalBool((a.value <= b.value).toString()),
  ">": (a, b) => new MalBool((a.value > b.value).toString()),
  ">=": (a, b) => new MalBool((a.value >= b.value).toString()),
};

module.exports = { ns };
