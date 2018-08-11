//@flow

module.exports = (modid) => {
  return id => {
    console.log(`Internal Error: sig[${modid}]${id}`);
  }
}