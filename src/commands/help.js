"use strict"; // Required by Node for ES6

// -- Local Variables --------------------------------------------------------------------------------------------------

const Command = require(__dirname + "/../command.js");

// -- Help Command -----------------------------------------------------------------------------------------------------

class Help extends Command {

    constructor() {
        super("Help");
        this.aliases     = ["Command", "Commands"];
        this.description = "Standard \"Help\" command. (Leave empty for a list of commands.)";
        this.usage       = "<command ...>";
    }

    findCommand(command) {

        for (let i in global.bot.commands) {

            let cmd = global.bot.commands[i];

            if (cmd.name.toLowerCase() === command) return cmd;
            if (cmd.aliases.toString().toLowerCase().indexOf(command) !== -1) return cmd;

        }

        return false;

    }

    execute(message) {

        let params = this.getParams(message);

        if (params.length) {

            let help = [];
            let notfound = false;

            params.forEach(param => {

                let command = this.findCommand(param.toLowerCase());

                if (!command) notfound = true;
                else {

                    let aliases = command.aliases.join(", ");
                    let cmd = global.bot.config.commandPrefix + command.name.toLowerCase();

                    help = help.concat([
                        `**${command.name + (aliases ? " (" + aliases + ")" : "")} Command:**`,
                        "```",
                        `Usage: ${cmd} ${command.usage}`,
                        command.description,
                        "```"
                    ]);

                }

            });

            if (notfound) help.push("Some of the requested commands could not be found.");

            return global.bot.client.sendMessage(message, help);

        }

        else {

            if (!message.channel.isPrivate) {
                global.bot.client.reply(message, "I've sent you a private message with a list of commands.");
            }

            return global.bot.client.sendMessage(message.author, [
                "**Available Commands:**",
                "```",
                Object.keys(global.bot.commands).join(", "),
                "```",
                "Type `" + global.bot.config.commandPrefix + "help command` for more detailed information."
            ]);

        }

    }

}

// -- Export Variables -------------------------------------------------------------------------------------------------

module.exports = Help;
