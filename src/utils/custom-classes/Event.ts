export class Event<T> {
  private consumed = false;

  constructor(private readonly content: T) {}

  getContentIfNotHandled(): T | null {
    if (this.consumed) return null;
    this.consumed = true;
    return this.content;
  }
}
