import * as _Oceanic from "oceanic.js";
import {
  Client as OceanicClient,
  ClientOptions as OceanicClientOptions,
  IntentNames,
  ClientEvents,
  ApplicationCommandTypes,
} from "oceanic.js";

declare function Trident(
  tridentOptions: Trident.TridentOptions
): Trident.TridentClient;

declare namespace Trident {
  export import Oceanic = _Oceanic;

  export const Constants: TridentConstants;
  export const VERSION: string;

  export class Event {
    constructor(event: keyof ClientEvents);
    _eventName: string;
    execute(): Promise<void>;
  }

  export class Embed {
    constructor();
    build(): object;
    setTitle(title: string): this;
    setDescription(): this;
    setUrl(url: string): this;
    setColor(color: string | number): this;
    setFooter(text: string, iconURL?: string): this;
    setAuthor(name: string, iconURL?: string, url?: string): this;
    setThumbnail(url: string): this;
    setImage(url: string): this;
    setTimestampDate(date: Date): this;
    setTimestampEpoch(timestamp: number): this;
    setTimestamp(timestamp?: string): this;
    addField(name: string, value: string, inline?: boolean): this;
  }

  export class Command {
    constructor();
    execute(): Promise<void>;
    type: ApplicationCommandTypes;
    nameLocalizations: object;
    descriptionLocalizations?: object;
    allowDms?: boolean | false;
    name: string;
    description: string;
    options: Array<any>;
    defaultMemberPermissions: null | string;
    guilds?: Array<string> | Promise<Array<string>>;
  }

  export class TridentClient extends OceanicClient {
    constructor(tridentOptions: TridentOptions);
  }

  interface TridentConstants {
    Colors: {
      DEFAULT: 0;
      AQUA: 1752220;
      DARK_AQUA: 1146986;
      GREEN: 3066993;
      DARK_GREEN: 2067276;
      BLUE: 3447003;
      DARK_BLUE: 2123412;
      PURPLE: 10181046;
      DARK_PURPLE: 7419530;
      LUMINOUS_VIVID_PINK: 15277667;
      DARK_VIVID_PINK: 11342935;
      GOLD: 15844367;
      DARK_GOLD: 12745742;
      ORANGE: 15105570;
      DARK_ORANGE: 11027200;
      RED: 15158332;
      DARK_RED: 10038562;
      GREY: 9807270;
      DARK_GREY: 9936031;
      DARKER_GREY: 8359053;
      LIGHT_GREY: 12370112;
      NAVY: 3426654;
      DARK_NAVY: 2899536;
      YELLOW: 16776960;
    };
    Events: Array<string>;
  }

  interface TridentOptions {
    token: string;
    intents: Array<IntentNames>;
    clearGuildCommandsOnStart: boolean;
    oceanicOptions: OceanicClientOptions;
  }
}

export = Trident;
