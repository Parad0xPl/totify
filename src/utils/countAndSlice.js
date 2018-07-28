//@flow

function countAndSlice(input: string, delimeter: string = ";"): [string[], number] {
  let buff: string = "";
  let arr: string[] = [];
  let counter: number = 0;
  for (let char of input) {
    if (char == delimeter) {
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