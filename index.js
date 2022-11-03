"use strict";

const TridentClient = require("./lib/Client");
const Constants = require("./lib/Constants");
const Event = require("./lib/Event");
const Command = require("./lib/Command");
const Embed = require("./lib/Embed");

function Trident(tridentOptions) {
  return new TridentClient(tridentOptions);
}

Trident.TridentClient = TridentClient;
Trident.Constants = Constants;
Trident.Event = Event;
Trident.Command = Command;
Trident.Embed = Embed;

Trident.Oceanic = require("oceanic.js");

module.exports = Trident;
