const {
  Client,
  ApplicationCommandTypes,
  InteractionTypes,
} = require("oceanic.js");
const Logger = require("../helpers/Logger");
const Constants = require("./Constants");
const Collection = require("../helpers/Collection");
const Command = require("../lib/Command");
const Event = require("./Event");
const path = require("path");
const readdirp = require("readdirp");

class TridentClient extends Client {
  constructor(tridentOptions) {
    if (!tridentOptions.token) {
      throw new Error("You must specify a valid Discord bot auth token!");
    }

    if (!tridentOptions.intents || tridentOptions.intents.length === 0) {
      throw new Error("You must include atleast 1 intent.");
    }

    if (tridentOptions.oceanicOptions) {
      tridentOptions.oceanicOptions.auth = "Bot " + tridentOptions.token;
    } else {
      tridentOptions.oceanicOptions = {
        auth: "Bot " + tridentOptions.token,
      };
    }

    tridentOptions.oceanicOptions.gateway = {
      intents: tridentOptions.intents,
    };

    super(tridentOptions.oceanicOptions);

    this.prefix = tridentOptions.prefix;
    this.clearGuildCommandsOnStart = tridentOptions.clearGuildCommandsOnStart;
    this.ignoreDirectories = tridentOptions.ignoreDirectories || [];

    this.events = new Set();
    this.interactions = new Collection();
    this.commands = new Collection();
    this.commandFiles = [];
    this.eventFiles = [];

    this._registerEvents();
    this.on("ready", this._onReady);
    this.on("interactionCreate", this._onInteractionCreate);
    this.connect();
  }

  async _registerApplicationCommands() {
    const globalCommands = [];
    const guildCommandsMap = {};

    for (const k of this.commands.keys()) {
      let cmd = this.commands.get(k);

      // Get interaction names
      Object.getOwnPropertyNames(Object.getPrototypeOf(cmd))
        .filter((m) => !["constructor", "execute"].includes(m))
        .forEach((m) => {
          if (this.interactions.has(m)) {
            throw new Error(
              `Interaction method "${m}" in command ${cmd.name} has duplicate interaction function names`
            );
          }
          this.interactions.set(m, cmd.name);
        });

      // sort by guilds and global
      if (!cmd.guilds || cmd.guilds === null) {
        globalCommands.push(k);
        continue;
      }

      if (typeof cmd.guilds === "function") {
        cmd.guilds = await cmd.guilds().catch((err) => err);
        if (
          cmd.guilds instanceof Error ||
          (cmd.guilds !== null && !Array.isArray(cmd.guilds))
        ) {
          console.log(cmd.guilds);
          throw new Error(`Failed to load guilds for command: ${k}`);
        }
      } else if (
        !cmd.guilds ||
        !Array.isArray(cmd.guilds) ||
        cmd.guilds.length === 0
      ) {
        throw new Error(
          `Guilds must be an array, null or promise, command: ${k}`
        );
      }

      for (let i = 0; i < cmd.guilds.length; i++) {
        const guild = cmd.guilds[i];
        if (!guildCommandsMap[guild]) {
          guildCommandsMap[guild] = [];
        }

        guildCommandsMap[guild].push(cmd.name);
      }
    }

    const currentGlobalCommands = await this.application.getGui;
    const guildKeys = Object.keys(guildCommandsMap);
    for (let i = 0; i < guildKeys.length; i++) {
      const guildId = guildKeys[i];
      const cmdNames = guildCommandsMap[guildKeys[i]];

      await this.application.bulkEditGuildCommands(
        guildId,
        cmdNames.map((cmdName) => {
          const cmd = this.commands.get(cmdName);

          switch (cmd.type) {
            case ApplicationCommandTypes.CHAT_INPUT:
              return {
                type: cmd.type,
                name: cmd.name,
                description: cmd.description,
                nameLocalizations: cmd.nameLocalizations || {},
                descriptionLocalizations: cmd.descriptionLocalizations || {},
                dmPermission: cmd.allowDms || false,
                options: cmd.options || undefined,
                defaultMemberPermissions: cmd.defaultMemberPermissions || null,
              };
            case ApplicationCommandTypes.MESSAGE:
              return {
                type: cmd.type,
                name: cmd.name,
                nameLocalizations: cmd.nameLocalizations || {},
                dmPermission: cmd.allowDms || false,
                defaultMemberPermissions: cmd.defaultMemberPermissions || null,
              };
            case ApplicationCommandTypes.USER:
              return {
                type: cmd.type,
                name: cmd.name,
                nameLocalizations: cmd.nameLocalizations || {},
                dmPermission: cmd.allowDms || false,
                defaultMemberPermissions: cmd.defaultMemberPermissions || null,
              };
          }
        })
      );
    }

    await this.application.bulkEditGlobalCommands(
      globalCommands.map((gcName) => {
        const cmd = this.commands.get(gcName);
        switch (cmd.type) {
          case ApplicationCommandTypes.CHAT_INPUT:
            return {
              type: cmd.type,
              name: cmd.name,
              description: cmd.description,
              nameLocalizations: cmd.nameLocalizations || {},
              descriptionLocalizations: cmd.descriptionLocalizations || {},
              dmPermission: cmd.allowDms || false,
              options: cmd.options || undefined,
              defaultMemberPermissions: cmd.defaultMemberPermissions || null,
            };
          case ApplicationCommandTypes.MESSAGE:
            return {
              type: cmd.type,
              name: cmd.name,
              nameLocalizations: cmd.nameLocalizations || {},
              dmPermission: cmd.allowDms || false,
              defaultMemberPermissions: cmd.defaultMemberPermissions || null,
            };
          case ApplicationCommandTypes.USER:
            return {
              type: cmd.type,
              name: cmd.name,
              nameLocalizations: cmd.nameLocalizations || {},
              dmPermission: cmd.allowDms || false,
              defaultMemberPermissions: cmd.defaultMemberPermissions || null,
            };
        }
      })
    );

    Logger.success(
      "COMMANDS",
      `Successfully loaded ${this.commands.size} ${
        this.commands.size === 1 ? "command" : "commands"
      }`
    );
  }

  async _registerEvents() {
    const tempDirPath = path.dirname(require.main.filename).endsWith("\\config")
      ? path.dirname(require.main.filename).replace("\\config", "")
      : path.dirname(require.main.filename);
    const directory = tempDirPath + "\\events";
    const customDirectoryFilter = this.ignoreDirectories;

    const readFiles = await readdirp.promise(directory, {
      fileFilter: "*.js",
      directoryFilter: ["!.git", "!*modules", ...customDirectoryFilter],
    });

    this.eventFiles = readFiles.map((file) => file.path);

    for (const eventFile of this.eventFiles) {
      let tridentEvent = require(path.join(directory, eventFile));
      if (tridentEvent.__esModule) {
        chariotEvent = tridentEvent.default;
      }

      tridentEvent.client = this;

      if (tridentEvent instanceof Event) {
        if (!Constants.Events.includes(tridentEvent._eventName)) {
          throw new Error(
            `Unknown event called "${tridentEvent._eventName}" in file "${eventFile}". Event names are case sensitive! Check https://abal.moe/Eris/docs/Client for an event overview.`
          );
        }

        if (typeof tridentEvent.execute === "undefined") {
          throw new Error(
            `Couldn't find main executor "execute" in event file "${eventFile}"!`
          );
        }

        this.events.add(tridentEvent);
      }
    }

    this.events.forEach((event) => {
      this.on(event._eventName, (args) => {
        event.execute(args, this);
      });
    });

    Logger.success(
      "EVENTS",
      `Successfully loaded ${this.events.size} ${
        this.events.size === 1 ? "event" : "events"
      }`
    );
  }

  async _registerCommands() {
    if (this.clearGuildCommandsOnStart) {
      for (const guild of this.guilds) {
        try {
          await this.application.bulkEditGuildCommands(guild[0], []);
        } catch {}
      }
    }

    const tempDirPath = path.dirname(require.main.filename).endsWith("\\config")
      ? path.dirname(require.main.filename).replace("\\config", "")
      : path.dirname(require.main.filename);
    const directory = tempDirPath + "\\commands";
    const customDirectoryFilter = this.ignoreDirectories;
    const readFiles = await readdirp.promise(directory, {
      fileFilter: "*.js",
      directoryFilter: ["!.git", "!*modules", ...customDirectoryFilter],
    });

    this.commandFiles = readFiles.map((file) => file.path);

    for (const cmdFile of this.commandFiles) {
      let cmd = require(path.join(directory, cmdFile));
      if (cmd.__esModule) {
        cmd = cmd.default;
      }

      if (cmd instanceof Command && this.commands.has(cmd.name)) {
        throw new Error(
          `A command with the name of ${cmd.name} has already been registered!`
        );
      }

      if (cmd instanceof Command) {
        this.commands.set(cmd.name, cmd);
      }
    }

    this._registerApplicationCommands();
  }

  _onReady() {
    Logger.success("STARTUP", "Client is ready!");

    this._registerCommands();
  }

  _onInteractionCreate(interaction) {
    switch (interaction.type) {
      case InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE:
      case InteractionTypes.APPLICATION_COMMAND:
        this.commands
          .get(interaction.data.name)
          .execute(interaction, interaction.user, this);
        break;
      case InteractionTypes.MESSAGE_COMPONENT:
      case InteractionTypes.MODAL_SUBMIT:
        const cmdName = this.interactions.get(interaction.data.customID);
        const cmd = this.commands.get(cmdName);
        try {
          cmd[interaction.data.customID](interaction, interaction.user, this);
        } catch (err) {
          Logger.error(
            "Interactions",
            `Received interaction but couldn't map it to a function (${interaction.data.customID} for command ${cmdName})`
          );
        }
        break;
    }
  }
}

module.exports = TridentClient;
