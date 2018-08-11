//@flow

const rand = require("randomatic");
const fs = require("fs");
const path = require("path");

const fn = path.join(process.cwd(), "authCode");
class Auth {

  code: string;

  constructor() {
    if (fs.existsSync(fn)) {
      this.code = fs.readFileSync(fn, "utf8");
    } else {
      this.generate();
    }
  }

  generate() {
    this.code = [
      rand("A", 4),
      rand("0", 4),
      rand("Aa", 4),
      rand("0", 4),
    ].join("-")
    fs.writeFileSync(fn, this.code, {
      flag: "w"
    });
  }

  get(): string {
    return this.code;
  }

}

module.exports = new Auth();