<p align="center">
  <a href="https://npmjs.com/package/trident.js"><img src="https://img.shields.io/npm/v/trident.js.svg?style=flat-square&color=informational"></a>
</p>

# About

**Trident.js** is an extremely lightweight, and easily extensible [Oceanic](https://github.com/OceanicJS/Oceanic) client framework handling application commands, events and interactions intelligently. The main goal of the project is to make the entry level into modern Discord bot development much more accessible to new developers, but also keeping its usefulness for all developers.
Trident.js comes with built in Embed builders!

# Usage

Trident Client (config/trident.js)

```js
const Trident = require("trident.js");

const tridentClient = new Trident.TridentClient({
  token:
    "" // create a bot and generate a token to put here, https://discord.com/developers/applications
  intents: [
    "DIRECT_MESSAGES",
    "GUILDS",
    "GUILD_INTEGRATIONS",
    "GUILD_MESSAGES",
    "GUILD_MEMBERS",
    "GUILD_PRESENCES",
    "MESSAGE_CONTENT",
  ],
  // ... way more options, including oceanicOptions
});

module.exports = tridentClient;
```

Commands (commands/ping.js)

```js
const Trident = require("trident.js");

class Ping extends Trident.Command {
  constructor() {
    super();

    this.name = "ping";
    this.description = "Use me!";
    this.allowDms = true;
    this.guilds = null; // null for global, array of guild ids to specify guilds or an async function that returns array of ids
    this.type = Trident.Oceanic.ApplicationCommandTypes.CHAT_INPUT;

    // more options such as nameLocalization, descriptionLocalization, etc..
  }

  async execute(interaction, user, trident) {
    interaction.createMessage({
      content: "Text body!",
      components: [
        {
          type: Trident.Oceanic.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Trident.Oceanic.ComponentTypes.BUTTON,
              style: Trident.Oceanic.ButtonStyles.PRIMARY,
              label: "Test Interactions",
              customID:
                "receiveInteraction" /** ID MUST match EXACTLY the name of the function below */,
            },
          ],
        },
      ],
      flags: 64,
    });
  }

  async receiveInteraction(interaction, user, trident) {
    return interaction.createMessage({
      content: "Thanks!",
      flags: 64,
    });
  }
}

module.exports = new Ping();
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
npm i trident.js --save
npx create-trident-app
```

# [Documentation](https://google.com)

Documentation is coming soon.

# License

Trident.js is released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.

This software makes use of the Discord API library **Oceanic** provided by [OceanicJS](https://github.com/OceanicJS), which is licensed under the [MIT License.](https://opensource.org/licenses/MIT)
