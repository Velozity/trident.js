const Trident = require("trident.js");

const tridentClient = new Trident.TridentClient({
  token: process.env.DISCORD_TOKEN,
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
