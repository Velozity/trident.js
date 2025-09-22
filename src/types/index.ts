import type {
  ClientOptions,
  ApplicationCommandTypes,
  EmbedOptions,
  EmbedField,
  EmbedFooter,
  EmbedAuthor,
  IntentNames,
} from "oceanic.js";

export type LogLevel =
  | "success"
  | "warning"
  | "error"
  | "debug"
  | "event"
  | "command";

export interface TridentClientOptions {
  token: string;
  prefix?: string;
  intents: number | Array<IntentNames | "ALL" | number>;
  clearGuildCommandsOnStart?: boolean;
  ignoreDirectories?: string[];
  oceanicOptions?: Omit<ClientOptions, "auth" | "gateway">;
}

export interface CommandOptions {
  name: string;
  description: string;
  type?: ApplicationCommandTypes;
  guilds?: string[] | (() => Promise<string[] | null>) | null;
  allowDms?: boolean;
  nameLocalizations?: Record<string, string>;
  descriptionLocalizations?: Record<string, string>;
  options?: any[];
  defaultMemberPermissions?: string | null;
}

// Re-export Oceanic.js embed types for convenience
export type EmbedData = EmbedOptions;
export type { EmbedField, EmbedFooter, EmbedAuthor };
export type ColorResolvable = number | string;
