"use strict"; // Required by Node for ES6

// -- Node Modules -----------------------------------------------------------------------------------------------------

const duration = require("humanize-duration");

// -- Local Variables --------------------------------------------------------------------------------------------------

const Command = require(__dirname + "/../command.js");

// -- Ping Command -----------------------------------------------------------------------------------------------------

class Ping extends Command {

    constructor() {
        super("Ping");
        this.aliases     = ["Pong"];
        this.description = "Pings and returns the response time.";
    }

    execute(message) {

        let cmd = message.content.substr(global.bot.config.commandPrefix.length).split(" ")[0].toLowerCase();
        let response = (cmd === "pong" ? "Ping?" : "Pong!");

        return global.bot.client.sendMessage(message, response, (error, nMessage) => {

            let diff = duration(message.timestamp - nMessage.timestamp, { "units" : ["s", "ms"] });

            global.bot.client.updateMessage(nMessage, `${nMessage.content} *(${diff})*`);

        });

    }

}

// -- Export Variables -------------------------------------------------------------------------------------------------

module.exports = Ping;
