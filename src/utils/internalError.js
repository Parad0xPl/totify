//@flow

const debug = require("debug")("totify:ie");

module.exports = (modid) => {
  return (id, e) => {
    console.log(`Internal Error: sig[${modid}]${id}`);
    if (e) {
      debug(e);
    }
  }
}