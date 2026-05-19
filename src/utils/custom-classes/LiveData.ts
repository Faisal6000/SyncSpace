export class Observable<T> {
  protected observers: ((value: T) => void)[] = [];

  subscribe(observer: (value: T) => void): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: (value: T) => void): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  protected notify(value: T): void {
    this.observers.forEach(o => o(value));
  }
}

export class LiveData<T> extends Observable<T> {
  constructor(private value: T) {
    super();
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
    this.notify(newValue);
  }

  override subscribe(observer: (value: T) => void): void {
    super.subscribe(observer);
    observer(this.value); // Emit current value immediately on subscribe
  }
}
