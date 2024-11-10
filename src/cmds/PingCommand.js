const BotCommand = require('../core/BotCommand.js');

/**
 * The PingCommand class represents a simple bot command that responds to a ping message.
 * When executed, the bot replies with "Pong!" unless the message comes from another bot.
 * 
 * @class PingCommand
 * @extends BotCommand
 * @description This class handles the "ping" command by replying with "Pong!" when invoked.
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 * 
 */
class PingCommand extends BotCommand {
  /**
   * Creates an instance of the PingCommand class.
   * Calls the constructor of the parent class (BotCommand).
   * 
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Executes the Ping command.
   * The bot replies with "Pong!" to the user unless the message was sent by a bot.
   * 
   * @method execute
   * @memberof PingCommand
   * @description This method checks if the message is from a bot. If not, it replies with "Pong!".
   * It is typically triggered when a user sends a "ping" message in the server.
   */
  execute() {
    // Checks if the message is from a bot. If it is, no reply is sent.
    if (this.isFromBot()) {
      return;  // No reply if the message is from a bot.
    }

    // Replies with "Pong!" to the user.
    this.message.reply("Pong!");
  }
}

module.exports = PingCommand;
