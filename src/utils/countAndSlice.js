//@flow

/**
 * Split string to array by separator and count occurance of it`s
 *
 * @param {string} input Input string
 * @param {string} [separator=";"] Separator to split and count it`s occurance 
 * @returns {[string[], number]}
 */
function countAndSlice(input: string, separator: string = ";"): [string[], number] {
  let buff: string = "";
  let arr: string[] = [];
  let counter: number = 0;
  for (let char of input) {
    if (char == separator) {
      counter++;
      arr.push(buff);
      buff = "";
    } else {
      buff = buff.concat(char);
    }
  }
  arr.push(buff);
  return [arr, counter];
}

module.exports = countAndSlice;