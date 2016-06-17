"use strict"; // Required by Node for ES6

// -- Command Base Class -----------------------------------------------------------------------------------------------

class Command {

    constructor(name) {

        if (!name) throw new Error("Commands must have a name!");
        this.name = name;

        this.aliases = [];
        this.description = "Command not configured properly.";
        this.nsfw = false;
        this.usage = "";

        console.log("[Commands]", `"${name}" command loaded.`);

    }

    execute(message) {
        return global.bot.client.sendMessage(message, "Command not configured properly.");
    }

    getParams(message) {
        message.content = message.content.substr(global.bot.config.commandPrefix.length);
        return message.content.split(" ").slice(1);
    }

}

// -- Export Variables -------------------------------------------------------------------------------------------------

module.exports = Command;
