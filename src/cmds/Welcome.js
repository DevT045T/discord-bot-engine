const BotCommand = require('../core/BotCommand.js');
const config = require('../config.js');

/**
 * The Welcome class is the class that handles, when a
 * member joined the guild
 * 
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 * 
 */
class Welcome extends BotCommand {
  /**
   * Constructor for the Welcome class.
   * Calls the constructor of the parent class (BotCommand).
   */
  constructor() {
    super();
  }

  /**
   * Executes the welcome logic.
   */
  execute() {
    const channel = this.message.guild.channels.cache.get(config().welcome_channel_ID);
    if (channel) {
      channel.send(`Heyyy, ${this.message}! Welcome to ${this.message.guild.name}. You are the ${this.message.guild.memberCount}th member <3`);
    }
  }
}

module.exports = Welcome;
