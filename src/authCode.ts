import rand from "randomatic";
import fs from "fs";
import path from "path";

const fn = path.join(process.cwd(), "authCode");
/**
 * Authcode handler
 *
 * @class Auth
 */
class Auth {

  code: string;

  /**
   * Creates an instance of Auth.
   * @memberof Auth
   */
  constructor() {
    this.code = "";
    if (fs.existsSync(fn)) {
      this.code = fs.readFileSync(fn, "utf8");
    } else {
      this.generate();
    }
  }

  /**
   * Generate new code and write it to file
   *
   * @memberof Auth
   */
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

  /**
   * Get current code
   *
   * @returns {string}
   * @memberof Auth
   */
  get(): string {
    return this.code;
  }
}

export default new Auth();