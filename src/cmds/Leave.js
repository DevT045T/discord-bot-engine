const BotCommand = require('../core/BotCommand.js');
const config = require('../config.js');

/**
 * The Leave class handles the logic when a member leaves the guild.
 * It sends a farewell message to the designated leave channel.
 * 
 * @class Leave
 * @extends BotCommand
 * @description This class is triggered when a member leaves the server, sending a farewell message
 * to the configured leave channel with details about the member.
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 * 
 */
class Leave extends BotCommand {
  /**
   * Creates an instance of the Leave class.
   * Calls the constructor of the parent class (BotCommand).
   * 
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Executes the leave logic when a member leaves the guild.
   * Sends a farewell message to the configured leave channel.
   * 
   * @method execute
   * @memberof Leave
   * @description This method is triggered when a member leaves the server. It sends a farewell message 
   * to the configured leave channel, notifying others that the member has left.
   */
  execute() {
    // Retrieve the leave channel by its ID
    const channel = this.message.guild.channels.cache.get(config().leave_channel_ID);

    // If the channel exists, send a farewell message
    if (channel) {
      channel.send(`${this.message} left us! :c`);
    }
  }
}

module.exports = Leave;
