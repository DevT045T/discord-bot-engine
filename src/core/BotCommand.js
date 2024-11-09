/**
 * Abstract base class for bot commands.
 * Ensures that all subclasses implement the `execute` method.
 * 
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 * 
 * @abstract
 */
class BotCommand {
    constructor() {
      if (this.constructor === BotCommand) {
        throw new Error("BotCommand is an abstract class and cannot be instantiated directly.");
      }
  
      this._message = null; // Initialize the message property as null
    }
  
    /**
     * Sets the message attribute.
     * @param {object} message - The Discord message object to be stored.
     */
    set message(message) {
      this._message = message;
    }
  
    /**
     * Gets the message attribute.
     * @returns {object} The stored Discord message object.
     */
    get message() {
      return this._message;
    }
  
    /**
     * Checks if the stored message is from a bot.
     * @returns {boolean} True if the message is from a bot, false otherwise.
     */
    isFromBot() {
      return this._message && this._message.author && this._message.author.bot;
    }
  
    /**
     * Abstract execute method to be implemented in subclasses.
     * @abstract
     */
    execute() {
      throw new Error("Subclass must implement the 'execute' method.");
    }
  }
  
  module.exports = BotCommand;