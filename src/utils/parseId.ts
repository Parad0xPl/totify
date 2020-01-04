function parseId(rawId: string): number {
  let id: number = parseInt(rawId);
  if (isNaN(id)) {
    id = 1;
  }
  id = Math.max(id, 1)
  id = Math.trunc(id);
  return id;
}
export default parseId;