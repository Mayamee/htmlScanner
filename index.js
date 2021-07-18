const scanner = require("./scanner");
const URL =
  process.argv[2] ||
  ((this_is_alert) => {
    console.log("Syntax: <url> <element/.class/#id>");
    process.exit(-1);
  })();
const elem = process.argv[3] || "body";
scanner(URL, elem);
