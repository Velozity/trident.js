import { EventName } from "./Constants";
import { TridentClient } from "./Client";

export abstract class Event {
  public readonly eventName: EventName;

  constructor(eventName: EventName) {
    this.eventName = eventName;
  }

  /**
   * Execute method that must be implemented by subclasses
   */
  abstract execute(args: any, client: TridentClient): void | Promise<void>;
}
