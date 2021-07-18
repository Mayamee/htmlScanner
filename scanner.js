const request = require("request");
const NHP = require("node-html-parser").parse;
const fs = require("fs");
async function scanner(link, target) {
  const classOfParse = target;
  const URL = link;
  function dataResolver(e) {
    if (e.tagName == "A") {
      return {
        target: e.tagName,
        html: e.innerHTML.match(/.+/g),
        href: e.getAttribute("href"),
      };
    } else if (e.tagName == "IMG") {
      return { target: e.tagName, src: e.getAttribute("src") };
    } else if (e.tagName == "SCRIPT") {
      return {
        target: e.tagName,
        src: e.getAttribute("src") || "no source root",
        eval: e.innerHTML,
      };
    } else if (e.tagName == "IFRAME") {
      return {
        target: e.tagName,
        href: e.getAttribute("src"),
      };
    }
    return { target: e.tagName, html: e.innerHTML.match(/.+/g) };
  }
  console.log(`Scanner is working on (${URL})...`);
  await (() => {
    return new Promise((r) => {
      request(URL, (err, res, body) => {
        if (err) throw new Error();
        const document = NHP(body);
        const text = document.querySelectorAll(classOfParse) || [];
        if (text.length != 0) {
          const output = text.map((e) => {
            return dataResolver(e);
          });
          fs.writeFileSync("out.json", JSON.stringify(output));
          console.log(output);
        } else {
          console.log(`target: {${classOfParse}} not found`);
        }
        r();
      });
    });
  })();
  console.log("Done");
}
module.exports = scanner;
