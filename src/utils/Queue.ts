import EventEmiter from "events";

/**
 * Simple queue with asynchronous support
 *
 * @class Queue
 * @extends {EventEmiter}
 * @template T
 */
class Queue<T> extends EventEmiter {
  queue: Array<T>;

  /**
   * Creates an instance of Queue.
   * @memberof Queue
   */
  constructor() {
    super();
    this.queue = [];
  }

  /**
   * Return length of queue
   *
   * @readonly
   * @type {number}
   * @memberof Queue
   */
  get length(): number {
    return this.queue.length;
  }

  /**
   * Add element to queue
   *
   * @param {T} el
   * @memberof Queue
   */
  add(el: T) {
    this.queue.push(el);
    this.emit("add");
  }

  /**
   * Asynchronous remove first element of queue.
   * Resolve only with element. There is no timeout
   *
   * @returns {Promise<T>}
   * @memberof Queue
   */
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

  /**
   * Synchronous remove
   *
   * @returns {(T | undefined)}
   * @memberof Queue
   */
  removeSync(): T | undefined {
    this.emit("remove");
    return this.queue.shift();
  }

  /**
   * Add many elements to queue
   *
   * @param {Array<T>} arr
   * @memberof Queue
   */
  concat(arr: Array<T>) {
    if (arr.length > 0) {
      this.queue = this.queue.concat(arr);
      this.emit("add");
    }
  }
}

export default Queue;