//@flow

module.exports = function parseId(rawId: any): number {
  let id: number = parseInt(rawId);
  if (isNaN(id)) {
    id = 1;
  }
  id = Math.max(id, 1)
  id = Math.trunc(id);
  return id;
}