const BotCommand = require('../core/BotCommand.js');
const config = require('../config.js');

/**
 * The Welcome class handles the logic when a new member joins the guild.
 * It sends a welcome message to the designated welcome channel with details about the new member.
 * 
 * @class Welcome
 * @extends BotCommand
 * @description This command welcomes new members to the server, informing them of their rank and the server name.
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 * 
 */
class Welcome extends BotCommand {
  /**
   * Creates an instance of the Welcome class.
   * Calls the constructor of the parent class (BotCommand).
   * 
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Executes the welcome logic when a new member joins the guild.
   * Sends a welcome message to the specified welcome channel.
   * 
   * @method execute
   * @memberof Welcome
   * @description This method is triggered when a new member joins the server. It sends a welcome message 
   * to the configured welcome channel and mentions the new member along with the server name and their rank 
   * in the server.
   */
  execute() {
    // Retrieve the welcome channel by its ID
    const channel = this.message.guild.channels.cache.get(config().welcome_channel_ID);
    
    // If the channel exists, send a welcome message
    if (channel) {
      channel.send(`Heyyy, ${this.message}! Welcome to ${this.message.guild.name}. You are the ${this.message.guild.memberCount}th member <3`);
    }
  }
}

module.exports = Welcome;
