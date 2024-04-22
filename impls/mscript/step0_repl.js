const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const rl = readline.createInterface({ input, output });

const READ = (str) => str;
const EVAL = (str) => str;
const PRINT = (str) => str;
const rep = (str) => PRINT(EVAL(READ(str)));

const repl = () => {
  rl.question("user> ", (answer) => {
    console.log(rep(answer));
    repl();
  });
};

repl();
