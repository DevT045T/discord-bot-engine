const config = require('../config.js');
const BotCommand = require('../core/BotCommand.js');
const fs = require('fs');
const path = require('path');

/**
 * The XPSystem class is responsible for handling the experience points (XP) system in the bot.
 * It listens for messages, calculates XP based on the message length, and updates the user's XP in a file.
 * This class inherits from the BotCommand class and implements the `execute` method to manage XP.
 * 
 * @class XPSystem
 * @extends BotCommand
 * @description This command updates the user's XP when they send messages. XP is calculated based on the length of the message.
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 * 
 */
class XPSystem extends BotCommand {
    /**
     * Creates an instance of the XPSystem class.
     * Calls the constructor of the parent class (BotCommand).
     * 
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Executes the XP system command. This method processes messages that are not from a bot,
     * calculates the XP based on the message length, and updates the user's XP data in a JSON file.
     * 
     * @method execute
     * @memberof XPSystem
     * @description When a valid message is detected, it adds XP to the user's record based on the message length.
     * If the message is from a bot, no action is taken.
     */
    execute() {
        // Checks if the message is from a bot.
        if (this.isFromBot()) {
            return;  // No reply if the message is from a bot.
        }

        // Adds XP to the user's data based on the message length and the configured XP factor.
        this.addXPData(this.message.content.length * config().xp_factor);
        this.increaseRole();
    }

    /**
     * Adds or updates the XP data for a user in a JSON file specific to the guild (server).
     * If the file doesn't exist, it will be created with an empty object.
     * The user's XP is incremented based on the input XP value.
     * 
     * @method addXPData
     * @memberof XPSystem
     * @param {number} XP - The amount of XP to add to the user's total.
     * @description This method writes the XP data to a JSON file that is named based on the guild's ID.
     * If the user already has XP data, it will be incremented. If not, a new record will be created for the user.
     */
    addXPData(XP) {
        const dataFilePath = path.join(global.projectRoot, 'data', `_${this.message.guild.id}.json`);
        const userID = this.message.author.id;

        // If the file does not exist, create it with an empty object as the content
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, JSON.stringify({}, null, 2));
        }

        // Read the existing XP data and update it
        if (fs.existsSync(dataFilePath)) {
            const rawData = fs.readFileSync(dataFilePath);
            let xpData = JSON.parse(rawData);

            if (XP >= 25) {
                XP = 25;
            }

            // Update or create the user's XP record
            if (xpData[userID]) {
                xpData[userID].xp += XP;
            } else {
                xpData[userID] = { xp: XP, level: 1 };  // Start the user at level 1
            }

            // Write the updated data back to the file
            fs.writeFileSync(dataFilePath, JSON.stringify(xpData, null, 2));
        }
    }

    /**
     * Increases the user's level based on their accumulated XP and updates the role.
     * 
     * This method reads the user's XP data from a JSON file, calculates the new level based on the 
     * current XP, and updates the user's level if it has changed. If the level changes, the data is 
     * written back to the JSON file, and a congratulatory message is sent to the channel.
     *
     * The level is calculated by dividing the total XP by a base value defined in the configuration
     * (config().xp_level_base). If the new level is different from the current level, the user's level
     * is updated, and the change is saved.
     *
     * @returns {void} 
     * 
     */
    increaseRole() {
        const dataFilePath = path.join(global.projectRoot, 'data', `_${this.message.guild.id}.json`);
        const userID = this.message.author.id;

        if (!fs.existsSync(dataFilePath)) {
            return;
        }

        const rawData = fs.readFileSync(dataFilePath);
        let xpData = JSON.parse(rawData);
        const calculatedLevel = Math.floor(xpData[userID].xp / config().xp_level_base);

        if (calculatedLevel != xpData[userID].level) {
            xpData[userID].level = calculatedLevel;
            fs.writeFileSync(dataFilePath, JSON.stringify(xpData, null, 2));
            this.message.channel.send(`Congratulations ${this.message.author}, you are now Level ${calculatedLevel}.`);
        }
    }
}

module.exports = XPSystem;
