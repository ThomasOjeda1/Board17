export class TriggerDebugger {
  watched: HTMLElement;
  observer: MutationObserver;
  config: any;
  constructor(watched: HTMLElement, config: any, callback: any) {
    this.watched = watched;
    this.config = config;
    // Create an observer instance linked to the callback function
    this.observer = new MutationObserver(callback);
  }

  stopObserving() {
    this.observer.disconnect;
  }

  startObserving() {
    this.observer.observe(this.watched, this.config);
  }
}
