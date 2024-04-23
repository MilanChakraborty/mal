const { rl } = require("./readline.js");
const { read_str } = require("./Reader.js");
const { pr_str } = require("./printer.js");
const {
  MalValue,
  MalList,
  MalSymbol,
  MalEnclosures,
} = require("./types.js");

const eval_ast = (ast, env) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const value = env[ast.pr_str()];
      if (!value) return ast;
      return value;

    case ast instanceof MalList && !ast.isEmpty():
      const [fn, ...args] = ast.args.map((e) => EVAL(e, env));
      return fn.apply(
        null,
        args.map((a) => a.value)
      );

    case ast instanceof MalEnclosures:
      ast.args = ast.args.map((a) => EVAL(a, env));
      return ast;

    default:
      return ast;
  }
};

const READ = (str) => read_str(str);
const EVAL = (ast, env) => eval_ast(ast, env);
const PRINT = (str) => pr_str(str);

const repl_env = {
  "+": (...args) => new MalValue(args.reduce((a, b) => a + b)),
  "-": (...args) => new MalValue(args.reduce((a, b) => a - b)),
  "*": (...args) => new MalValue(args.reduce((a, b) => a * b)),
  "/": (...args) => new MalValue(args.reduce((a, b) => a / b)),
};

const rep = (str) => PRINT(EVAL(READ(str), repl_env));

const repl = () => {
  rl.question("user> ", (answer) => {
    try {
      rep(answer, repl_env);
    } catch (e) {
      console.error(e);
    }
    repl();
  });
};

repl();
