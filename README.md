# Discord Bot Engine

## Description

**Discord Bot Engine** is a customizable framework for building and managing a Discord bot using Node.js. It provides an easy-to-use command structure where new commands can be added quickly by simply modifying the `commands.js` and adding corresponding classes in the `src/cmds` directory. The bot is designed to be extendable, making it easy to add more commands and features as required.

**Important Note**: Never push your `bot_token` to public repositories! Always keep sensitive data like tokens secure.

## Features

- **Customizable Commands**: Easily add new bot commands by defining them in `commands.js` and creating corresponding command classes.
- **Prefix Handling**: Define a prefix for the bot commands, making it easy to trigger bot actions.
- **Bot Token Management**: Configure and securely manage the bot token in `config.js`.
- **Extendable Framework**: Create new command classes that extend `BotCommand` and implement the `execute()` method.
- **User-friendly**: Outputs clear and readable results to the Discord channel.

## Installation

To set up and run **Discord Bot Engine**, follow these steps:

1. Ensure you have **Node.js** installed. You can download it from [nodejs.org](https://nodejs.org/).
2. Clone or download the project:

```bash
git clone git@github.com:DevT045T/discord-bot-engine.git
cd discord-bot-engine
```

3. Install the required dependencies:

```bash
npm install
```

## Configuration

Before running the bot, make sure to configure your bot's settings in `config.js`:

```js
module.exports = () => {
    return {
        "bot_token": "YOUR_BOT_TOKEN_HERE", // DO NOT push your bot token to GitHub 😉
        "welcome_channel_ID": "YOUR_CHANNEL_ID",
        "prefix": "$"
    };
};
```

**Important**: Do not commit or push your `bot_token`. Replace `"YOUR_BOT_TOKEN_HERE"` with your actual token, but make sure you keep it private.

## Running the Bot

To start the bot, simply run:

```bash
npm start
```

This will start the bot, and it will begin listening for messages and commands in the specified channels.

## Adding New Commands

### 1. Update `commands.js`

In `commands.js`, add a new command by creating an object that specifies the `command` and the corresponding class:

```js
module.exports = () => {
    return [
        {
            "command": "ping",
            "class": "PingCommand"
        },
        // Add your new command here
    ];
};
```

### 2. Create the Command Class

In the `src/cmds` directory, create a new file with the same name as your command class. For example, if the command class is `PingCommand`, create a file named `PingCommand.js`:

```js
const BotCommand = require('../core/BotCommand.js');

class PingCommand extends BotCommand {
  constructor() {
    super();
  }


  execute() {
    if (this.isFromBot()) {
      return;
    }

    this.message.reply("Pong!");
  }
}

module.exports = PingCommand;
```

### 3. BotCommand Class

Each command must extend the `BotCommand` class, which can be found in `core/BotCommand.js`. Here's an example of the base class:

### 4. Command File Naming Convention

The filename of the command class must match the class name exactly. For example, if you create a `PingCommand` class, the file should be named `PingCommand.js`.

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

### Contributing

Feel free to fork this project, make improvements, and submit pull requests. Contributions are always welcome!

---

**Disclaimer**: Always remember **DO NOT** push sensitive information like the `bot_token` to public repositories. You can use `.gitignore` to exclude `config.js` or any file that contains sensitive data.