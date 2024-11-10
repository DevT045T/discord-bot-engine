const BotCommand = require('../core/BotCommand.js');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.js');
const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const sharp = require('sharp');

/**
 * The Leaderboard class represents a bot command that generates a leaderboard image 
 * showing the top 10 users based on their XP in the guild.
 * 
 * @class Leaderboard
 * @extends BotCommand
 * @description This class handles the "leaderboard" command by creating and sending an 
 * image with the top 10 users' XP and levels.
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 */
class Leaderboard extends BotCommand {
  constructor() {
    super();
  }

  /**
   * Executes the leaderboard command and generates an image with the top 10 users.
   */
  async execute() {
    if (this.isFromBot()) {
      return;
    }

    const dataFilePath = path.join(global.projectRoot, 'data', 'xp', `_${this.message.guild.id}.json`);

    if (!fs.existsSync(dataFilePath)) {
      return;
    }

    const rawData = fs.readFileSync(dataFilePath);
    let xpData = JSON.parse(rawData);

    // Sort users by XP in descending order and get the top 10
    const sortedUsers = Object.entries(xpData)
      .map(([userID, data]) => ({ userID, xp: data.xp }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);

    // Create canvas for the leaderboard image
    const canvas = createCanvas(400, 500);
    const context = canvas.getContext('2d');

    // Draw starry background
    this.drawStarryBackground(context, canvas.width, canvas.height);

    const xPosition = canvas.width / 2;
    let yPosition = 70; // Starting position for text

    // Display leaderboard and level information
    for (const [index, user] of sortedUsers.entries()) {
      const userID = user.userID;
      const currentXP = xpData[userID].xp;
      const levelBaseXP = config().xp_level_base;
      const calculatedLevel = Math.floor(currentXP / levelBaseXP);

      // Load user data and avatar
      const avatarBuffer = await this.loadImageFromUrl(`https://cdn.discordapp.com/avatars/${userID}/${this.message.guild.members.cache.get(userID)?.user.avatar}.png?size=256`);
      const pngBuffer = await sharp(avatarBuffer).png().toBuffer();

      // Draw avatar and text on the canvas (avatar further to the right)
      await this.drawAvatar(context, pngBuffer, xPosition - 175, yPosition, 50);
      this.drawText(context, `#${index + 1} ${this.message.guild.members.cache.get(userID)?.user.username}`, xPosition, yPosition + 20, 'bold 20px Arial', '#ffffff');
      this.drawText(context, `Level: ${calculatedLevel}`, xPosition, yPosition + 40, '16px Arial', '#ffffff');
      this.drawText(context, `XP: ${currentXP}`, xPosition, yPosition + 60, '16px Arial', '#ffffff');

      yPosition += 80; // Move to next row
    }

    // Create the attachment with the image
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'Leaderboard-image.png' });
    this.message.channel.send({ files: [attachment] });
  }

  /**
   * Loads an image from a given URL.
   * @param {string} url The URL of the image to load.
   * @returns {Promise<Buffer>} The image buffer.
   */
  async loadImageFromUrl(url) {
    if (!url || url.includes('undefined')) {
      return await this.loadImageFromUrl('https://cdn.discordapp.com/embed/avatars/0.png');
    }

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error('Error downloading image: ' + error.message);
    }
  }

  /**
   * Draws a starry background on the canvas.
   * @param {CanvasRenderingContext2D} context The canvas context to draw on.
   * @param {number} width The width of the canvas.
   * @param {number} height The height of the canvas.
   */
  drawStarryBackground(context, width, height) {
    // Black background
    context.fillStyle = '#000000';
    context.fillRect(0, 0, width, height);

    // Add stars
    const numberOfStars = 100;
    for (let i = 0; i < numberOfStars; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 2;
      context.fillStyle = '#ffffff';
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    // Draw title at the top center
    context.fillStyle = '#ecf0f1';
    context.font = 'bold 30px Arial';
    const title = 'Leaderboard';
    context.fillText(title, width / 2 - context.measureText(title).width / 2, 35);
  }

  /**
   * Draws an avatar on the canvas.
   * @param {CanvasRenderingContext2D} context The canvas context to draw on.
   * @param {Buffer} avatarBuffer The image buffer for the avatar.
   * @param {number} x The x position to draw the avatar.
   * @param {number} y The y position to draw the avatar.
   * @param {number} size The size of the avatar.
   */
  async drawAvatar(context, avatarBuffer, x, y, size) {
    const avatarImage = await loadImage(avatarBuffer);
    context.save();
    context.beginPath();
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, false);
    context.clip();
    context.drawImage(avatarImage, x, y, size, size);
    context.restore();
  }

  /**
   * Draws text on the canvas.
   * @param {CanvasRenderingContext2D} context The canvas context to draw on.
   * @param {string} text The text to display.
   * @param {number} x The x position to draw the text.
   * @param {number} y The y position to draw the text.
   * @param {string} font The font style of the text.
   * @param {string} color The color of the text.
   */
  drawText(context, text, x, y, font, color) {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x - context.measureText(text).width / 2, y);
  }
}

module.exports = Leaderboard;
