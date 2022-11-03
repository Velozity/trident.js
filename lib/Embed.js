const Constants = require("./Constants");

class Embed {
  constructor() {
    this._embed = {
      title: undefined,
      description: undefined,
      color: Constants.Colors.BLUE,
    };
  }

  build() {
    if (
      typeof this._embed.title === "undefined" ||
      typeof this._embed.description === "undefined"
    ) {
      throw new Error("Embed must have a title and description at a minimum.");
    }

    return this._embed;
  }

  setTitle(title) {
    this._embed.title = title;
    return this;
  }

  setUrl(url) {
    this._embed.url = url;
    return this;
  }

  setFooter(text, iconURL = null, url = null) {
    this._embed.footer = {
      text,
      iconURL,
      url,
    };
    return this;
  }

  setAuthor(name, iconURL = null) {
    this._embed.author = {
      name,
      iconURL,
    };
    return this;
  }

  setThumbnail(url) {
    this._embed.thumbnail = {
      url,
    };
    return this;
  }

  setImage(url) {
    this._embed.image = {
      url,
    };
    return this;
  }

  setTimestampDate(date) {
    if (!(date instanceof Date)) {
      throw new Error("setTimestampDate must be supplied a proper Date object");
    }

    this._embed.timestamp = date.toISOString();
    return this;
  }

  setTimestampEpoch(timestamp) {
    if (typeof timestamp !== "number") {
      throw new Error("setTimestampEpoch must be supplied a proper Number");
    }

    this._embed.timestamp = new Date(Number(timestamp) * 1000).toISOString();
    return this;
  }

  setTimestamp(timestamp = "now") {
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

  /** Color can be the name of a color, hex, decimal or 'random'  */
  setColor(color) {
    if (typeof color !== "string" && typeof color !== "number") {
      throw new Error(`Invalid color "${color}" for embeds`);
    }

    if (typeof color === "string") {
      color = color.toUpperCase();
      if (color === "RANDOM") {
        color =
          Constants.Colors[
            Math.floor(Math.random() * Object.keys(Constants.Colors).length)
          ];
      }
    }

    this._embed.color =
      typeof color === "string" ? Constants.Colors[color] : color;
    return this;
  }

  addField(name, value, inline) {
    this._embed.fields.push({
      name,
      value,
      inline: inline || false,
    });
    return this;
  }

  setDescription(description) {
    this._embed.description = description;
    return this;
  }
}

module.exports = Embed;
