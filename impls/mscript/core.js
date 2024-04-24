const { MalValue, MalBool } = require("./types");

const ns = {
  "+": (...args) => new MalValue(args.reduce((a, b) => a + b)),
  "-": (...args) => new MalValue(args.reduce((a, b) => a - b)),
  "*": (...args) => new MalValue(args.reduce((a, b) => a * b)),
  "/": (...args) => new MalValue(args.reduce((a, b) => a / b)),
  "<": (a, b) => new MalBool((a < b).toString()),
  "<=": (a, b) => new MalBool((a <= b).toString()),
  ">": (a, b) => new MalBool((a > b).toString()),
  ">=": (a, b) => new MalBool((a >= b).toString()),
};

module.exports = { ns };
