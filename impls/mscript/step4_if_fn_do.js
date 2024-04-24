const { rl } = require("./readline.js");
const { read_str } = require("./Reader.js");
const { pr_str } = require("./printer.js");
const { Env } = require("./env.js");
const lo = require("lodash");
const {
  MalValue,
  MalList,
  MalSymbol,
  MalEnclosures,
  MalNil,
  MalBool,
  MalFunction,
} = require("./types.js");

const addBinding = (symbol, value, env) => {
  const val = EVAL(value, env);
  env.setBinding(symbol.value, val.value);
  return val;
};

const handleDef = (ast, env) => {
  const [_, symbol, val] = ast.args;
  return addBinding(symbol, val, env);
};

const handleLet = (ast, env) => {
  const newEnv = new Env(env);
  const [_, bindings, body] = ast.args;
  lo.chunk(bindings.args, 2).forEach(([symbol, value]) =>
    addBinding(symbol, value, newEnv)
  );

  return !body ? new MalNil() : EVAL(body, newEnv);
};

const isFunc = (fnName, ast) => ast.args.at(0).value === fnName;

const eval_ast = (ast, env) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const value = env.get(ast.value);
      if (!value) return ast;
      return typeof value === "function"
        ? new MalFunction(value)
        : new MalValue(value);

    case ast instanceof MalList && !ast.isEmpty():
      if (isFunc("def!", ast)) return handleDef(ast, env);
      if (isFunc("let*", ast)) return handleLet(ast, env);
      const [fn, ...args] = ast.args.map((e) => EVAL(e, env));
      return fn.value.apply(
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

const createGlobalEnvironment = () => {
  const env = new Env();
  env.setBinding("+", (...args) => new MalValue(args.reduce((a, b) => a + b)));
  env.setBinding("-", (...args) => new MalValue(args.reduce((a, b) => a - b)));
  env.setBinding("*", (...args) => new MalValue(args.reduce((a, b) => a * b)));
  env.setBinding("/", (...args) => new MalValue(args.reduce((a, b) => a / b)));
  env.setBinding("<", (a, b) => new MalBool(a < b));
  env.setBinding("<=", (a, b) => new MalBool(a <= b));
  env.setBinding(">", (a, b) => new MalBool(a > b));
  env.setBinding(">=", (a, b) => new MalBool(a >= b));

  return env;
};

const rep = (str, env) => PRINT(EVAL(READ(str), env));
const globalEnv = createGlobalEnvironment();

const repl = () => {
  rl.question("user> ", (answer) => {
    try {
      rep(answer, globalEnv);
    } catch (e) {
      console.error(e);
    }
    repl();
  });
};

repl();
