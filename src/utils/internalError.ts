import _debug from "debug";
const debug = _debug("totify:ie");

export default (modid: string) => {
  return (id: number, e: Error) => {
    console.log(`Internal Error: sig[${modid}]${id}`);
    if (e) {
      debug(e.toString());
    }
  }
}