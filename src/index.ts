export { TridentClient } from "./lib/Client";
export { Command } from "./lib/Command";
export { Event } from "./lib/Event";
export { Embed } from "./lib/Embed";
export { Logger } from "./helpers/Logger";
export { Collection } from "./helpers/Collection";
export { Colors, Events } from "./lib/Constants";
export * from "./types";

// Re-export Oceanic.js types for convenience
export {
  ApplicationCommandTypes,
  InteractionTypes,
  ComponentTypes,
  ButtonStyles,
  AnyInteractionGateway,
  User,
  ComponentInteraction,
  CommandInteraction,
  ApplicationCommandOptionTypes,
  ChannelTypes,
} from "oceanic.js";

// Create a namespace for easier access to Oceanic.js types
import * as OceanicTypes from "oceanic.js";
export namespace Oceanic {
  export const Types = OceanicTypes;
}

// Default export for convenience
import { TridentClient } from "./lib/Client";
export default TridentClient;
