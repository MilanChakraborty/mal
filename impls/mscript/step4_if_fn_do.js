const { rl } = require("./readline.js");
const { read_str } = require("./Reader.js");
const { pr_str } = require("./printer.js");
const { Env } = require("./env.js");
const lo = require("lodash");
const core = require("./core.js");
const {
  MalValue,
  MalList,
  MalSymbol,
  MalEnclosures,
  MalNil,
  MalFunction,
} = require("./types.js");

const addBinding = (symbol, value, env) => {
  const val = EVAL(value, env);
  env.setBinding(symbol.value, val.value);
  return val;
};

const handleDef = (ast, env) => {
  const [_, symbol, val] = ast.value;
  return addBinding(symbol, val, env);
};

const handleLet = (ast, env) => {
  const newEnv = new Env(env);
  const [_, bindings, body] = ast.value;
  lo.chunk(bindings.value, 2).forEach(([symbol, value]) =>
    addBinding(symbol, value, newEnv)
  );

  return !body ? new MalNil() : EVAL(body, newEnv);
};

const handleDo = (ast, env) => {
  [_, ...statements] = ast.value;
  return statements.map((a) => EVAL(a, env)).at(-1);
};

const handleIf = (ast, env) => {
  const [_, test, then, otherwise] = ast.value;
  if (EVAL(test, env).value !== false) return EVAL(then, env);
  if (!otherwise) return new MalNil();

  return EVAL(otherwise, env);
};

const handleFunction = (ast, env) => {
  const [_, binds, body] = ast.value;
  const newEnv = env.createEnvWithBinds(binds.value.map((a) => a.value));

  const fnReference = (...args) => {
    newEnv.addMappingsForBinds(args);
    return EVAL(body, newEnv);
  };

  return new MalFunction(fnReference);
};

const specialForms = {
  "def!": handleDef,
  "let*": handleLet,
  do: handleDo,
  if: handleIf,
  "fn*": handleFunction,
};

const isSpecialForm = (ast) => specialForms[ast.value.at(0).value];

const handleSpecialForm = (ast, env) => {
  const specialFormHandler = specialForms[ast.value.at(0).value];
  return specialFormHandler(ast, env);
};

const wrapInType = (value) => {
  switch (true) {
    case typeof value === "function":
      return new MalFunction(value);
    case typeof value === "number":
      return new MalValue(value);
    default:
      return value;
  }
};

const eval_ast = (ast, env) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const value = env.get(ast.value);
      if (!value) return ast;
      return wrapInType(value);

    case ast instanceof MalList && !ast.isEmpty():
      if (isSpecialForm(ast)) return handleSpecialForm(ast, env);
      const [fn, ...args] = ast.value.map((e) => EVAL(e, env));
      return fn.value.apply(null, args);

    case ast instanceof MalEnclosures:
      ast.value = ast.value.map((a) => EVAL(a, env));
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
  Object.entries(core.ns).forEach(([symbol, value]) => {
    env.setBinding(symbol, value);
  });

  return env;
};

const rep = (str, env) => PRINT(EVAL(READ(str), env));
const globalEnv = createGlobalEnvironment();

rep("(def! not (fn* (a) (if a false true)))", globalEnv);
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
