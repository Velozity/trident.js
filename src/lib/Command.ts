import {
  AnyInteractionGateway,
  ApplicationCommandTypes,
  User,
} from "oceanic.js";
import { CommandOptions } from "../types";
import { TridentClient } from "./Client";

export abstract class Command {
  public name: string;
  public description: string;
  public type: ApplicationCommandTypes;
  public guilds?: string[] | (() => Promise<string[] | null>) | null;
  public allowDms: boolean;
  public nameLocalizations?: Record<string, string>;
  public descriptionLocalizations?: Record<string, string>;
  public options?: any[];
  public defaultMemberPermissions?: string | null;

  constructor(options?: CommandOptions) {
    this.name = options?.name ?? "";
    this.description = options?.description ?? "";
    this.type = options?.type ?? ApplicationCommandTypes.CHAT_INPUT;
    this.guilds = options?.guilds;
    this.allowDms = options?.allowDms ?? false;
    this.nameLocalizations = options?.nameLocalizations;
    this.descriptionLocalizations = options?.descriptionLocalizations;
    this.options = options?.options;
    this.defaultMemberPermissions = options?.defaultMemberPermissions;
  }

  public abstract execute(
    interaction: AnyInteractionGateway,
    user: User,
    client: TridentClient
  ): any | Promise<any>;
}
