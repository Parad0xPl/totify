import ee from "events";

class Queue<T> extends ee {
  queue: Array<T>;

  constructor() {
    super();
    this.queue = [];
  }

  get length(): number {
    return this.queue.length;
  }

  add(el: T) {
    this.queue.push(el);
    this.emit("add");
  }

  remove(): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.queue.length > 0) {
        this.emit("remove");
        resolve(this.queue.shift());
      } else {
        this.once("add", () => {
          resolve(this.removeSync());
        })
      }
    });
  }

  removeSync(): T | undefined {
    this.emit("remove");
    return this.queue.shift();
  }

  concat(arr: Array<T>) {
    if (arr.length > 0) {
      this.queue = this.queue.concat(arr);
      this.emit("add");
    }
  }
}

export default Queue;