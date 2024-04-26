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
  MalCoreFunction,
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

const wrapInDoForm = (body) => {
  return new MalList([new MalSymbol("do")].concat(body));
};

const handleLet = (ast, env) => {
  const newEnv = new Env(env);
  const [_, bindings, ...body] = ast.value;
  lo.chunk(bindings.value, 2).forEach(([symbol, value]) =>
    addBinding(symbol, value, newEnv)
  );
  const newAst = body.length === 0 ? new MalNil() : wrapInDoForm(body);
  return { newAst, newEnv };
};

const handleDo = (ast, env) => {
  [, ...statements] = ast.value;
  statements.slice(0, -1).forEach((statement) => EVAL(statement, env));
  return statements.at(-1);
};

const handleIf = (ast, env) => {
  const [, test, then, otherwise] = ast.value;
  if (EVAL(test, env).value !== false) return then;
  if (!otherwise) return new MalNil();

  return otherwise;
};

const handleFunction = (ast, env) => {
  const [, binds, ...body] = ast.value;

  return new MalFunction(
    wrapInDoForm(body),
    env,
    binds.value.map((a) => a.value)
  );
};

const wrapInType = (value) => {
  switch (true) {
    case typeof value === "function":
      return new MalCoreFunction(value);
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

    case ast instanceof MalEnclosures:
      ast.value = ast.value.map((a) => EVAL(a, env));
      return ast;

    default:
      return ast;
  }
};

const READ = (str) => read_str(str);

const EVAL = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env);
    if (ast.isEmpty()) return ast;

    switch (ast.value[0].value) {
      case "def!":
        return handleDef(ast, env);

      case "let*": {
        const { newAst, newEnv } = handleLet(ast, env);
        env = newEnv;
        ast = newAst;
        break;
      }

      case "do": {
        ast = handleDo(ast, env);
        break;
      }

      case "if": {
        ast = handleIf(ast, env);
        break;
      }

      case "fn*": {
        return handleFunction(ast, env);
      }

      default: {
        const [fn, ...args] = ast.value.map((e) => EVAL(e, env));

        if (fn instanceof MalFunction) {
          ast = fn.body;
          env = new Env(fn.env, fn.binds, args);
          break;
        }

        return fn.value.apply(null, args);
      }
    }
  }
};
const PRINT = (str) => pr_str(str);

const loadLib = (nameSpace, env) => {
  Object.entries(nameSpace.ns).forEach(([symbol, value]) => {
    env.setBinding(symbol, value);
  });
};

const createGlobalEnvironment = () => {
  const env = new Env();
  loadLib(core, env);

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
