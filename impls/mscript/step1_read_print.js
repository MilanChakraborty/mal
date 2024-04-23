const { rl } = require("./readline.js");
const { read_str } = require("./Reader.js");
const { pr_str } = require("./printer.js");

const READ = (str) => read_str(str);
const EVAL = (str) => str;
const PRINT = (str) => pr_str(str);

const rep = (str) => PRINT(EVAL(READ(str)));

const repl = () => {
  rl.question("user> ", (answer) => {
    try {
      rep(answer);
    } catch (e) {
      console.error(e);
    }
    repl();
  });
};

repl();
