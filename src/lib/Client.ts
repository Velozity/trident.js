import {
  Client,
  CreateApplicationCommandOptions,
  InteractionTypes,
  AnyInteractionGateway,
} from "oceanic.js";
import { TridentClientOptions } from "../types";
import { Command } from "./Command";
import { Logger } from "./Logger";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

export class TridentClient extends Client {
  public readonly token: string;
  public readonly prefix?: string;
  public readonly clearGuildCommandsOnStart: boolean;
  public readonly forceCommandRegistration: boolean;
  public readonly ignoreDirectories: string[];
  public readonly logger: Logger;
  private _commandsToRegister: Map<string, Command> = new Map();
  private commands: Map<string, Command> = new Map();
  private readonly commandCacheFile: string;

  constructor(options: TridentClientOptions) {
    super({
      auth: `Bot ${options.token}`,
      gateway: {
        intents: options.intents,
      },
      ...options.oceanicOptions,
    });

    this.token = options.token;
    this.prefix = options.prefix;
    this.clearGuildCommandsOnStart = options.clearGuildCommandsOnStart ?? false;
    this.forceCommandRegistration = options.forceCommandRegistration ?? false;
    this.ignoreDirectories = options.ignoreDirectories ?? [
      "node_modules",
      ".git",
      "dist",
    ];
    this.logger = new Logger();
    this.commandCacheFile = path.join(
      process.cwd(),
      ".trident-commands-cache.json"
    );

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.on("ready", () => {
      this.logger.log("success", `${this.user?.username} is ready!`);
      this.loadCommands();
    });

    this.on("interactionCreate", async (interaction: AnyInteractionGateway) => {
      if (interaction.type === InteractionTypes.APPLICATION_COMMAND) {
        const command = this.commands.get(interaction.data.name);
        if (command) {
          try {
            await command.execute(interaction, interaction.user, this);
            this.logger.log("command", `Executed command: ${command.name}`);
          } catch (error) {
            this.logger.log(
              "error",
              `Error executing command ${command.name}: ${error}`
            );
          }
        }
      } else if (interaction.type === InteractionTypes.MESSAGE_COMPONENT) {
        const command = this.commands.get(
          (interaction.message.interactionMetadata as any).name
        );
        if (
          command &&
          typeof (command as any)[interaction.data.customID] === "function"
        ) {
          try {
            await (command as any)[interaction.data.customID](
              interaction,
              interaction.user,
              this
            );
            this.logger.log(
              "command",
              `Executed component interaction: ${interaction.data.customID} for command: ${command.name}`
            );
          } catch (error) {
            this.logger.log(
              "error",
              `Error executing component interaction ${interaction.data.customID} for command ${command.name}: ${error}`
            );
          }
        }
      }
    });

    this.on("error", (error) => {
      this.logger.log("error", `Client error: ${error.toString()}`);
    });

    this.on("debug", (message) => {
      this.logger.log("debug", message);
    });
  }

  private async loadCommands(): Promise<void> {
    try {
      const commandsPath = path.join(process.cwd(), "src", "commands");
      if (!fs.existsSync(commandsPath)) {
        this.logger.log("warning", "Commands directory not found");
        return;
      }

      await this.loadCommandsFromDirectory(commandsPath);
      await this.registerCommands();
    } catch (error) {
      this.logger.log("error", `Failed to load commands: ${error}`);
    }
  }

  private async loadCommandsFromDirectory(directory: string): Promise<void> {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !this.ignoreDirectories.includes(file)) {
        await this.loadCommandsFromDirectory(filePath);
      } else if (file.endsWith(".ts") || file.endsWith(".js")) {
        try {
          const commandModule = await import(filePath);
          const CommandClass =
            commandModule.default ||
            commandModule[Object.keys(commandModule)[0]];

          if (CommandClass && CommandClass.prototype instanceof Command) {
            const command = new CommandClass();
            this._commandsToRegister.set(command.name, command);
            this.logger.log(
              "success",
              `Loaded command to register: ${command.name}`
            );
          }
        } catch (error) {
          this.logger.log(
            "error",
            `Failed to load command to register from ${file}: ${error}`
          );
        }
      }
    }
  }

  private async registerCommands(): Promise<void> {
    if (this.clearGuildCommandsOnStart) {
      await this.clearGuildCommands();
    }

    const commandsToRegister: Array<CreateApplicationCommandOptions> =
      Array.from(this._commandsToRegister.values()).map((cmd) => ({
        name: cmd.name,
        description: cmd.description,
        type: cmd.type as number,
        options: cmd.options,
        nameLocalizations: cmd.nameLocalizations,
        descriptionLocalizations: cmd.descriptionLocalizations,
        defaultMemberPermissions: cmd.defaultMemberPermissions,
      }));

    // Check if commands have changed
    const commandsHash = this.generateCommandsHash(commandsToRegister);
    const cachedHash = this.getCachedCommandsHash();

    if (
      commandsHash === cachedHash &&
      !this.clearGuildCommandsOnStart &&
      !this.forceCommandRegistration
    ) {
      this.logger.log(
        "debug",
        "Commands haven't changed, skipping registration"
      );
      this.commands = this._commandsToRegister;
      return;
    }

    try {
      this.logger.log("debug", "Commands changed, registering with Discord...");
      await this.application.bulkEditGlobalCommands(commandsToRegister);
      this.commands = this._commandsToRegister;

      // Save the new hash
      this.saveCachedCommandsHash(commandsHash);

      this.logger.log(
        "success",
        `Registered ${this.commands.size} global commands`
      );
    } catch (error) {
      this.logger.log("error", `Failed to register commands: ${error}`);
    }
  }

  private async clearGuildCommands(): Promise<void> {
    try {
      const guilds = this.guilds.map((guild) => guild.id);
      for (const guildId of guilds) {
        await this.application.bulkEditGuildCommands(guildId, []);
      }
      this.logger.log("success", "Cleared guild commands");
    } catch (error) {
      this.logger.log("error", `Failed to clear guild commands: ${error}`);
    }
  }

  public getCommand(name: string): Command | undefined {
    return this.commands.get(name);
  }

  public getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  public async start(): Promise<void> {
    try {
      await this.connect();
      this.logger.log("success", "Client connected successfully");
    } catch (error) {
      this.logger.log("error", `Failed to start client: ${error}`);
      throw error;
    }
  }

  private generateCommandsHash(
    commands: Array<CreateApplicationCommandOptions>
  ): string {
    const commandsString = JSON.stringify(commands, null, 0);
    return crypto.createHash("md5").update(commandsString).digest("hex");
  }

  private getCachedCommandsHash(): string | null {
    try {
      if (fs.existsSync(this.commandCacheFile)) {
        const cache = JSON.parse(
          fs.readFileSync(this.commandCacheFile, "utf-8")
        );
        return cache.hash || null;
      }
    } catch (error) {
      this.logger.log("debug", `Failed to read commands cache: ${error}`);
    }
    return null;
  }

  private saveCachedCommandsHash(hash: string): void {
    try {
      const cache = {
        hash,
        timestamp: Date.now(),
      };
      fs.writeFileSync(this.commandCacheFile, JSON.stringify(cache, null, 2));
    } catch (error) {
      this.logger.log("debug", `Failed to save commands cache: ${error}`);
    }
  }
}
