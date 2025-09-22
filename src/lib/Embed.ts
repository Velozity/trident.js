import { Colors } from "./Constants";
import { EmbedData, ColorResolvable } from "../types";

export class Embed {
  private _embed: EmbedData;

  constructor() {
    this._embed = {
      title: undefined,
      description: undefined,
      color: Colors.BLUE,
      fields: [],
    };
  }

  /**
   * Build and validate the embed
   */
  build(): EmbedData {
    if (!this._embed.title || !this._embed.description) {
      throw new Error("Embed must have a title and description at a minimum.");
    }
    return { ...this._embed };
  }

  /**
   * Set the embed title
   */
  setTitle(title: string): this {
    this._embed.title = title;
    return this;
  }

  /**
   * Set the embed URL
   */
  setUrl(url: string): this {
    this._embed.url = url;
    return this;
  }

  /**
   * Set the embed footer
   */
  setFooter(text: string, iconURL?: string): this {
    this._embed.footer = { text, iconURL };
    return this;
  }

  /**
   * Set the embed author
   */
  setAuthor(name: string, iconURL?: string): this {
    this._embed.author = { name, iconURL };
    return this;
  }

  /**
   * Set the embed thumbnail
   */
  setThumbnail(url: string): this {
    this._embed.thumbnail = { url };
    return this;
  }

  /**
   * Set the embed image
   */
  setImage(url: string): this {
    this._embed.image = { url };
    return this;
  }

  /**
   * Set timestamp from Date object
   */
  setTimestampDate(date: Date): this {
    if (!(date instanceof Date)) {
      throw new Error("setTimestampDate must be supplied a proper Date object");
    }
    this._embed.timestamp = date.toISOString();
    return this;
  }

  /**
   * Set timestamp from epoch
   */
  setTimestampEpoch(timestamp: number): this {
    if (typeof timestamp !== "number") {
      throw new Error("setTimestampEpoch must be supplied a proper Number");
    }
    this._embed.timestamp = new Date(timestamp * 1000).toISOString();
    return this;
  }

  /**
   * Set timestamp (now or ISO string)
   */
  setTimestamp(timestamp: string | "now" = "now"): this {
    if (timestamp === "now") {
      this._embed.timestamp = new Date().toISOString();
    } else {
      if (typeof timestamp !== "string") {
        throw new Error("setTimestamp must be supplied a proper ISO String");
      }
      this._embed.timestamp = timestamp;
    }
    return this;
  }

  /**
   * Set embed color
   */
  setColor(color: ColorResolvable): this {
    if (typeof color !== "string" && typeof color !== "number") {
      throw new Error(`Invalid color "${color}" for embeds`);
    }

    if (typeof color === "string") {
      const upperColor = color.toUpperCase() as keyof typeof Colors | "RANDOM";
      if (upperColor === "RANDOM") {
        const colorKeys = Object.keys(Colors) as (keyof typeof Colors)[];
        const randomKey =
          colorKeys[Math.floor(Math.random() * colorKeys.length)];
        this._embed.color = Colors[randomKey];
      } else {
        this._embed.color = Colors[upperColor];
      }
    } else {
      this._embed.color = color;
    }

    return this;
  }

  /**
   * Add a field to the embed
   */
  addField(name: string, value: string, inline: boolean = false): this {
    if (!this._embed.fields) {
      this._embed.fields = [];
    }
    this._embed.fields.push({ name, value, inline });
    return this;
  }

  /**
   * Set the embed description
   */
  setDescription(description: string): this {
    this._embed.description = description;
    return this;
  }
}
