const BotCommand = require('../core/BotCommand.js');
const config = require('../config.js');

/**
 * The Leave class is the class that handles, when a
 * member leaves the guild
 * 
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 * 
 */
class Leave extends BotCommand {
  /**
   * Constructor for the Leave class.
   * Calls the constructor of the parent class (BotCommand).
   */
  constructor() {
    super();
  }

  /**
   * Executes the leave logic.
   */
  execute() {
    const channel = this.message.guild.channels.cache.get(config().leave_channel_ID);
    if (channel) {
      channel.send(`${this.message} left us! :c`);
    }
  }
}

module.exports = Leave;
