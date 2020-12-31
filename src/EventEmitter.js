// @flow strict

type HandlerType = () => mixed;

export class EventEmitter<EventType> {
  events: {[event: EventType]: Array<HandlerType>};

  constructor() {
    this.events = {};
  }

  on(event: EventType, handler: HandlerType): () => mixed {
    if (this.events[event] === undefined) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
    return () => this.off(event, handler);
  }

  off(event: EventType, handler: HandlerType) {
    if (this.events[event] !== undefined) {
      const index = this.events[event].indexOf(handler);

      if (index !== -1) {
        this.events[event].splice(index, 1);
      }
    }
  }

  emit(event: EventType, ...args: Array<mixed>) {
    if (this.events[event] !== undefined) {
      for (let i = 0; i < this.events[event].length; i++) {
        this.events[event][i].apply(null, args);
      }
    }
  }
}
