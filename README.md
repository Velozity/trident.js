# About

**Trident.js** is an extremely lightweight, and easily extensible [Oceanic](https://github.com/OceanicJS/Oceanic) client framework handling application commands, events and interactions intelligently. The main goal of the project is to make the entry level into modern Discord bot development much more accessible to new developers, but also keeping its usefulness for all developers.
Trident.js comes with built in Embed builders!

# Usage

```js
const Trident = require("trident.js");

const tridentClient = new Trident.TridentClient({
  token:
    "" // Create a bot and generate a token to put here, https://discord.com/developers/applications,
  intents: [
    "DIRECT_MESSAGES",
    "GUILDS",
    "GUILD_INTEGRATIONS",
    "GUILD_MESSAGES",
    "GUILD_MEMBERS",
    "GUILD_PRESENCES",
    "MESSAGE_CONTENT",
  ],
});

module.exports = tridentClient;
```

Recommended Project Structure

```sh
Project/
├── config/
│   └── trident.js
├── commands/
│   └── ping.js
├── events/
│   └── ready.js
└── index.js
```

For command, interactions & event examples, see the [examples](https://github.com/Velozity/trident.js/tree/master/examples) folder on GitHub.

<hr>

## Installation

NodeJS **16.16.0** or higher is required.

```sh
npm i trident.js
```

If you want to get right into a fresh bot with a pre-made template, you can with:

```sh
npm i trident.js-start
```

# [Documentation](https://google.com)

Documentation is coming soon.

# License

Trident.js is released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.

This software makes use of the Discord API library **Oceanic** provided by [OceanicJS](https://github.com/OceanicJS), which is licensed under the [MIT License.](https://opensource.org/licenses/MIT)
