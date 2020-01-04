import rand from "randomatic";
import fs from "fs";
import path from "path";

const fn = path.join(process.cwd(), "authCode");
class Auth {

  code: string;

  constructor() {
    this.code = "";
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

export default new Auth();