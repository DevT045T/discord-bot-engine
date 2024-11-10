const BotCommand = require('../core/BotCommand.js');
const { AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('canvas');
const os = require('os');
const axios = require('axios');
const config = require('../config.js');
const { execSync } = require('child_process');  // Added to execute git commands

/**
 * The Bot class represents the main bot that handles multiple commands 
 * and interactions within the server.
 *
 * @class Bot
 * @description This class sets up the bot, processes commands, and interacts with 
 * users and the server.
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 */
class BotInformation extends BotCommand {
  constructor() {
    super();
  }

  /**
   * Executes the BotInformation command by generating an image with server and bot details.
   * The image includes the bot's OS, server count, user count, and ping.
   */
  async execute() {
    // Avoid responding to bot messages
    if (this.isFromBot()) {
      return;
    }

    const canvas = createCanvas(400, 200); // Smaller canvas size
    const context = canvas.getContext('2d');

    // Draw a space background
    this.drawStarryBackground(context, canvas.width, canvas.height);

    // Draw the bot and server information
    this.drawText(context, 'Bot Info', 20, 30, 'bold 20px Arial', '#ffffff');
    this.drawText(context, `OS: ${os.platform()} ${os.release()}`, 20, 60, '15px Arial', '#ffffff');

    // Get the number of servers the bot is in (without cache)
    const serverCount = await this.getServerCount();
    this.drawText(context, `Servers: ${serverCount}`, 20, 90, '15px Arial', '#ffffff');

    // Get ping (latency)
    const ping = await this.getPing();
    this.drawText(context, `Ping: ${ping !== -1 ? `${ping} ms` : 'Error fetching ping'}`, 20, 120, '15px Arial', '#ffffff');

    // Fetch Git Username from Git config (if available)
    const gitUsername = this.getGitUsername() || 'Not Available'; // Fallback if no Git username is found
    this.drawText(context, `Developer: ${gitUsername}`, 20, 150, '15px Arial', '#ffffff');

    // Fetch Git Username from Git config (if available)
    this.drawText(context, `Powered by https://t045t.dev/`, 310, 190, '8px Arial', '#ffffff');

    // Create the image attachment and send it to the channel
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'BotInformation-image.png' });
    this.message.channel.send({ files: [attachment] });
  }

  /**
   * Fetches the number of servers the bot is in from the cache.
   * @returns {number} - The number of servers.
   */
  async getServerCount() {
    try {
      // Use the guilds cache to get the number of servers
      return global.botClient.guilds.cache.size;
    } catch (error) {
      console.error('Error fetching server count from cache:', error);
      return 0;
    }
  }


  /**
   * Gets the bot's ping by sending a request to the Discord API.
   * @returns {Promise<number>} - The bot's ping in milliseconds.
   */
  async getPing() {
    try {
      const start = Date.now();
      const res = await axios.get('https://discord.com/api/v10/gateway');
      const end = Date.now();
      return end - start; // Return the round-trip time in ms
    } catch (error) {
      console.error('Error fetching ping:', error);
      return -1; // If there's an error, return -1 as a fallback
    }
  }

  /**
   * Gets the Git username from the Git configuration.
   * @returns {string} - The Git username.
   */
  getGitUsername() {
    try {
      // Fetch the Git username using a git command
      const gitUser = execSync('git config --global user.name').toString().trim();
      return gitUser || null;
    } catch (error) {
      console.error('Error fetching Git username:', error);
      return null;
    }
  }

  /**
   * Draws a starry background on the canvas.
   * @param {CanvasRenderingContext2D} context - The canvas drawing context.
   * @param {number} width - The width of the canvas.
   * @param {number} height - The height of the canvas.
   */
  drawStarryBackground(context, width, height) {
    // Fill the background with black
    context.fillStyle = '#000000';
    context.fillRect(0, 0, width, height);

    // Generate random stars
    const numStars = 50; // Fewer stars for a smaller image
    context.fillStyle = '#ffffff'; // Stars in white color
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5; // Smaller stars
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2, false);
      context.fill();
    }
  }

  /**
   * Draws text on the canvas.
   * @param {CanvasRenderingContext2D} context - The canvas drawing context.
   * @param {string} text - The text to display.
   * @param {number} x - The x-coordinate where the text will be placed.
   * @param {number} y - The y-coordinate where the text will be placed.
   * @param {string} font - The font style of the text.
   * @param {string} color - The color of the text.
   */
  drawText(context, text, x, y, font, color) {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x, y);
  }
}

module.exports = BotInformation;
