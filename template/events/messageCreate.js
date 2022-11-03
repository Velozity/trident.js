/* eslint-disable class-methods-use-this */
const Trident = require("trident.js");

class MessageCreate extends Trident.Event {
  constructor() {
    super("messageCreate"); /** The strict name of the event */
  }

  /**
   * @param {Trident.Oceanic.Message} message
   */
  async execute(message) {}
}

module.exports = new MessageCreate();
