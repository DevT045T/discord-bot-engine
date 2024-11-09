const BotCommand = require('../core/BotCommand.js');

/**
 * The PingCommand class is an example of a bot command that responds to the ping command.
 * This class inherits from the BotCommand class and implements the `execute` method.
 * When executed, the bot replies with "Pong!".
 * 
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 * 
 */
class PingCommand extends BotCommand {
  /**
   * Constructor for the PingCommand class.
   * Calls the constructor of the parent class (BotCommand).
   */
  constructor() {
    super();
  }

  /**
   * Executes the Ping command.
   * Checks if the message is from a bot. If it is, no reply is sent.
   * Otherwise, the bot replies with "Pong!" to the user.
   */
  execute() {
    // Checks if the message is from a bot.
    if (this.isFromBot()) {
      return;  // No reply if the message is from a bot.
    }

    // Replies with "Pong!" to the user.
    this.message.reply("Pong!");
  }
}

module.exports = PingCommand;
