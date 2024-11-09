const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
const config = require('./config.js');

/**
 * @package discord-bot-engine
 * @author t045t
 * @link https://t045t.dev
 * @license MIT
 */

/**
 * Event listener that fires when the bot is ready.
 * Logs a message to the console indicating that the bot is online.
 */
client.once('ready', () => {
    console.log('Bot is online!');
});

/**
 * Event listener that triggers whenever a new message is created in a guild.
 * It checks if the message starts with the defined prefix and executes the corresponding command.
 * 
 * @param {Message} message - The message that triggered the event.
 */
client.on('messageCreate', message => {
    // Get the list of commands
    const commandsArray = require('./commands.js');

    // Check if the message starts with the prefix
    if (message.content.startsWith(config().prefix)) {
        commandsArray().forEach(command => {
            // Check if the command in the message matches any of the commands in the list
            if (command.command === message.content.replace(new RegExp(config().prefix), "")) {
                // Dynamically require and instantiate the command class
                const cmdClass = require(`./cmds/${command.class}.js`);
                const cmd = new cmdClass();
                cmd.message = message;
                cmd.execute();
            }
        })
    }
});

// Log in to Discord using the bot token
client.login(config().bot_token);
