/* eslint-disable class-methods-use-this */
const Trident = require("trident.js");

class Ready extends Trident.Event {
  constructor() {
    super("ready"); /** The strict name of the event */
  }

  async execute() {
    console.log("Ready event fired!");
  }
}

module.exports = new Ready();
