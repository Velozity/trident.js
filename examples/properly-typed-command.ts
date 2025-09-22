import {
  Command,
  ApplicationCommandTypes,
  AnyInteractionGateway,
  User,
  TridentClient,
  ComponentInteraction,
  CommandInteraction,
  ApplicationCommandOptionTypes,
} from "../src";

export default class Ping extends Command {
  constructor() {
    super({
      name: "ping",
      description: "Use me!",
      allowDms: true,
      guilds: null, // null for global, array of guild ids to specify guilds or an async function that returns array of ids
      type: ApplicationCommandTypes.CHAT_INPUT,
      options: [
        {
          type: ApplicationCommandOptionTypes.STRING,
          name: "text",
          description: "The text to echo back",
          required: true,
        },
        {
          type: ApplicationCommandOptionTypes.INTEGER,
          name: "times",
          description: "How many times to repeat",
          required: false,
        },
      ],
    });
  }

  // TypeScript will now infer the parameter types from the parent class!
  async execute(
    interaction: CommandInteraction,
    user: User,
    client: TridentClient
  ) {
    return interaction.createMessage({
      content: `Pong! Hello, ${user.username}!`,
      flags: 64,
    });
  }

  async receiveInteraction(
    interaction: ComponentInteraction,
    user: User,
    client: TridentClient
  ) {
    return interaction.createMessage({
      content: "Thanks!",
      flags: 64,
    });
  }
}
