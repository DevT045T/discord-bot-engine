const BotCommand = require('../core/BotCommand.js');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const sharp = require('sharp');

/**
 * The Level class manages the logic for displaying the user's current level and XP progress.
 * It generates a custom image with a progress bar and the user's level, displaying it in the chat.
 * 
 * @class Level
 * @extends BotCommand
 * @description This class is responsible for calculating the user's current level and XP progress,
 *              and generating an image with a progress bar, user avatar, and level details.
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 */
class Level extends BotCommand {
  constructor() {
    super();
  }

  /**
   * Executes the level command by generating an image with the user's level progress.
   * The image includes a background, a progress bar, the user's avatar, and level information.
   */
  async execute() {
    // Avoid responding to bot messages
    if (this.isFromBot()) {
      return;
    }

    const dataFilePath = path.join(global.projectRoot, 'data', 'xp', `_${this.message.guild.id}.json`);
    const userID = this.message.author.id;

    if (!fs.existsSync(dataFilePath)) {
      return;
    }

    const rawData = fs.readFileSync(dataFilePath);
    let xpData = JSON.parse(rawData);
    const currentXP = xpData[userID].xp;
    const levelBaseXP = config().xp_level_base;
    const calculatedLevel = Math.floor(currentXP / levelBaseXP);
    const nextLevelXP = (calculatedLevel + 1) * levelBaseXP;
    const progress = currentXP / nextLevelXP;

    // Create a canvas for the level image
    const canvas = createCanvas(800, 200);
    const context = canvas.getContext('2d');

    // Draw a starry background
    this.drawStarryBackground(context, canvas.width, canvas.height);

    // Draw the username and level information
    this.drawText(context, `@${this.message.author.username}`, 150, 50, 'bold 30px Arial', '#ffffff');
    this.drawText(context, `You're Level ${calculatedLevel}`, 150, 100, 'bold 30px Arial', '#ffffff');

    // Draw the XP progress bar
    this.drawProgressBar(context, 150, 120, 500, 30, progress, '#333333', '#6A329F');

    // Display the XP count
    this.drawText(context, `${currentXP} / ${nextLevelXP} XP`, 150, 170, '20px Arial', '#ffffff');

    try {
      // Download the user's avatar, convert it to PNG, and draw it in a circular shape
      const avatarBuffer = await this.loadImageFromUrl(this.message.author.displayAvatarURL({ dynamic: true }));
      const pngBuffer = await sharp(avatarBuffer).png().toBuffer();
      await this.drawAvatar(context, pngBuffer, 20, 20, 100);

      // Create the image attachment and send it to the channel
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'level-image.png' });
      this.message.channel.send({ files: [attachment] });
    } catch (err) {
      console.error('Error processing avatar or image:', err);
    }
  }

  /**
   * Loads an image from a URL and returns it as a Buffer.
   * @param {string} url - The URL of the image to download.
   * @returns {Buffer} - The image data as a Buffer.
   */
  async loadImageFromUrl(url) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error('Error downloading image: ' + error.message);
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
    const numStars = 100;
    context.fillStyle = '#ffffff'; // Stars in white color
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2; // Small stars
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

  /**
   * Draws a circular avatar on the canvas.
   * @param {CanvasRenderingContext2D} context - The canvas drawing context.
   * @param {Buffer} avatarBuffer - The avatar image data as a Buffer.
   * @param {number} x - The x-coordinate for the top-left corner of the avatar.
   * @param {number} y - The y-coordinate for the top-left corner of the avatar.
   * @param {number} size - The size of the avatar.
   */
  async drawAvatar(context, avatarBuffer, x, y, size) {
    const avatarImage = await loadImage(avatarBuffer);
    context.save(); // Save the current context
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, false); // Create circular clipping path
    context.clip(); // Clip the context to the circle
    context.drawImage(avatarImage, x, y, size, size); // Draw the avatar image
    context.restore(); // Restore the context to its original state
  }

  /**
   * Draws a progress bar on the canvas.
   * @param {CanvasRenderingContext2D} context - The canvas drawing context.
   * @param {number} x - The x-coordinate for the progress bar.
   * @param {number} y - The y-coordinate for the progress bar.
   * @param {number} width - The width of the progress bar.
   * @param {number} height - The height of the progress bar.
   * @param {number} progress - The progress (from 0 to 1).
   * @param {string} backgroundColor - The color of the progress bar background.
   * @param {string} progressColor - The color of the progress bar's fill.
   */
  drawProgressBar(context, x, y, width, height, progress, backgroundColor, progressColor) {
    // Draw the background of the progress bar
    context.fillStyle = backgroundColor;
    context.fillRect(x, y, width, height);

    // Draw the filled part of the progress bar
    context.fillStyle = progressColor;
    context.fillRect(x, y, width * progress, height);
  }
}

module.exports = Level;
