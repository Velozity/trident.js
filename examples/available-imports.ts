// Available imports from trident.js package
import {
  // Core classes
  Command,
  TridentClient,
  Event,
  Embed,
  Logger,
  Collection,

  // Type definitions
  TridentClientOptions,
  CommandOptions,
  LogLevel,
  EmbedData,
  EmbedField,
  EmbedFooter,
  EmbedAuthor,
  ColorResolvable,

  // Oceanic.js re-exports - All available types
  ApplicationCommandTypes,
  InteractionTypes,
  ComponentTypes,
  ButtonStyles,
  AnyInteractionGateway,
  User,
  ComponentInteraction,
  CommandInteraction,

  // Constants
  Colors,
  Events,
} from "trident.js";

// Alternative namespace syntax
import { Oceanic } from "trident.js";

export default class ExampleCommand extends Command {
  constructor() {
    super({
      name: "example",
      description: "Example command showing all available types",
      allowDms: true,
      guilds: null,
      type: ApplicationCommandTypes.CHAT_INPUT, // or Oceanic.ApplicationCommandTypes.CHAT_INPUT
      options: [],
    });
  }

  async execute(
    interaction: CommandInteraction,
    user: User,
    client: TridentClient
  ) {
    return interaction.createMessage({
      content: `Hello, ${user.username}!`,
      components: [
        {
          type: ComponentTypes.ACTION_ROW, // or Oceanic.ComponentTypes.ACTION_ROW
          components: [
            {
              type: ComponentTypes.BUTTON, // or Oceanic.ComponentTypes.BUTTON
              style: ButtonStyles.PRIMARY, // or Oceanic.ButtonStyles.PRIMARY
              label: "Click me!",
              customID: "example_button",
            },
          ],
        },
      ],
      flags: 64,
    });
  }
}

// If the user prefers the namespace syntax:
// type: Oceanic.ApplicationCommandTypes.CHAT_INPUT
// type: Oceanic.ComponentTypes.ACTION_ROW
// style: Oceanic.ButtonStyles.PRIMARY
