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
   * Executes the leaderboard command, creating and sending an image showing the top 10 users' XP and levels.
   * 
   * @async
   * @returns {Promise<void>}
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

    const sortedUsers = Object.entries(xpData)
      .map(([userID, data]) => ({ userID, xp: data.xp }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);

    const canvas = createCanvas(400, 500);
    const context = canvas.getContext('2d');

    this.drawStarryBackground(context, canvas.width, canvas.height);

    const xPosition = canvas.width / 2;
    let yPosition = 70;

    for (const [index, user] of sortedUsers.entries()) {
      const userID = user.userID;
      const currentXP = xpData[userID].xp;
      const levelBaseXP = config().xp_level_base;
      const calculatedLevel = Math.floor(currentXP / levelBaseXP);

      // Get user data from Discord API for every user
      const userData = await this.fetchUserData(userID);

      const userAvatar = userData.avatar;
      const userName = userData.username || "Unknown User"; // Default name if undefined

      const avatarBuffer = await this.loadImageFromUrl(
        `https://cdn.discordapp.com/avatars/${userID}/${userAvatar}.png?size=256`
      );
      const pngBuffer = await sharp(avatarBuffer).png().toBuffer();

      await this.drawAvatar(context, pngBuffer, xPosition - 175, yPosition, 50);
      this.drawText(context, `#${index + 1} ${userName}`, xPosition, yPosition + 20, 'bold 20px Arial', '#ffffff');
      this.drawText(context, `Level: ${calculatedLevel}`, xPosition, yPosition + 40, '16px Arial', '#ffffff');
      this.drawText(context, `XP: ${currentXP}`, xPosition, yPosition + 60, '16px Arial', '#ffffff');

      yPosition += 80;
    }

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'Leaderboard-image.png' });
    this.message.channel.send({ files: [attachment] });
  }

  /**
   * Fetches user data from the Discord API.
   * 
   * @async
   * @param {string} userID - The Discord user ID.
   * @returns {Promise<object>} The user data object.
   * @throws {Error} If there is an error fetching user data.
   */
  async fetchUserData(userID) {
    try {
      const response = await axios.get(`https://discord.com/api/v10/users/${userID}`, {
        headers: {
          Authorization: `Bot ${config().bot_token}`,
        },
      });

      const userData = response.data;
      return {
        username: userData.username,
        avatar: userData.avatar || 'default',
      };
    } catch (error) {
      throw new Error('Error fetching user data: ' + error.message);
    }
  }

  /**
   * Loads an image from a URL.
   * If the URL is undefined or invalid, loads a default avatar image.
   * 
   * @async
   * @param {string} url - The URL of the image.
   * @returns {Promise<Buffer>} The image buffer.
   * @throws {Error} If there is an error downloading the image.
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
   * 
   * @param {CanvasRenderingContext2D} context - The canvas drawing context.
   * @param {number} width - The width of the canvas.
   * @param {number} height - The height of the canvas.
   */
  drawStarryBackground(context, width, height) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, width, height);

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

    context.fillStyle = '#ecf0f1';
    context.font = 'bold 30px Arial';
    const title = 'Leaderboard';
    context.fillText(title, width / 2 - context.measureText(title).width / 2, 35);
  }

  /**
   * Draws the user's avatar on the canvas.
   * 
   * @async
   * @param {CanvasRenderingContext2D} context - The canvas drawing context.
   * @param {Buffer} avatarBuffer - The avatar image buffer.
   * @param {number} x - The x position to draw the avatar.
   * @param {number} y - The y position to draw the avatar.
   * @param {number} size - The size of the avatar.
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
   * Draws text on the canvas at a specified position.
   * 
   * @param {CanvasRenderingContext2D} context - The canvas drawing context.
   * @param {string} text - The text to draw.
   * @param {number} x - The x position to draw the text.
   * @param {number} y - The y position to draw the text.
   * @param {string} font - The font to use for the text.
   * @param {string} color - The color of the text.
   */
  drawText(context, text, x, y, font, color) {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x - context.measureText(text).width / 2, y);
  }
}

module.exports = Leaderboard;
