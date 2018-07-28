//@flow

let path = require("path");

module.exports = (instanceName?: string): string => {
  let socketPathArgs = ["/tmp"];
  if (process.platform == "win32") {
    socketPathArgs = ['\\\\?\\pipe'];
  }
  if (instanceName) {
    socketPathArgs.push(`totify_${instanceName}`);
  } else {
    socketPathArgs.push(`totify`);
  }

  const socketPath = path.join.apply(path, socketPathArgs);
  return socketPath;
}