const Trident = require("trident.js");

const tridentClient = new Trident.TridentClient({
  token:
    "" /** Create a bot and generate a token to put here, https://discord.com/developers/applications */,
  intents: [
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MEMBERS",
    "MESSAGE_CONTENT",
    "GUILDS",
    "DIRECT_MESSAGES",
    "GUILD_INTEGRATIONS",
  ] /** Modify to your bots requirements */,
});

module.exports = tridentClient;
