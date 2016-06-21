"use strict"; // Required by Node for ES6

// -- Node Modules -----------------------------------------------------------------------------------------------------

const Client           = require("discord.js").Client;
const jsonFile         = require("jsonfile");
const requireDirectory = require("require-directory");

// -- Local Variables --------------------------------------------------------------------------------------------------

var client   = new Client({ "maxCachedMessages" : 200, "autoReconnect" : true });
var admin    = requireDirectory(module, __dirname + "/src/admin", { visit : cmd => new cmd() });
var commands = requireDirectory(module, __dirname + "/src/commands", { visit : cmd => new cmd() });
var config = require('./config');
//var config   = require(__dirname + "/config.json");

jsonFile.spaces = 2;

// -- Initialization ---------------------------------------------------------------------------------------------------

client.once("ready", () => {
	console.log("[Ready] SBot ready to command!");
});

// -- Command Parsers --------------------------------------------------------------------------------------------------

client.on("message", message => {
	//console.log(message.channel);

	if (message.author.equals(client.user)) return; // Prevents bot from gaining sentience

	if (message.content.indexOf(config.commandPrefix) === 0) {

		let cmd = message.content.substr(config.commandPrefix.length).split(" ")[0].toLowerCase();
		if (!cmd) return; // null command bugfix

		if (!message.channel.isPrivate && message.author.equals(message.channel.server.owner)) {
			for (let i in admin) {
				let command = admin[i];
				if (command.name.toLowerCase() === cmd) return command.execute(message);
				if (command.aliases.toString().toLowerCase().indexOf(cmd) !== -1) return command.execute(message);
			}
		}

		for (let i in commands) {
			let command = commands[i];
			if (command.name.toLowerCase() === cmd) return command.execute(message);
			if (command.aliases.toString().toLowerCase().indexOf(cmd) !== -1) return command.execute(message);
		}

	}

});

// -- Config File Helpers ----------------------------------------------------------------------------------------------

function loadConfigFile() {
	config = jsonFile.readFileSync(__dirname + "/config.json");
}

function saveConfigFile() {
	jsonFile.writeFileSync(__dirname + "/config.json", config);
}

// -- Program Entry Point (Login) --------------------------------------------------------------------------------------

config.token ? client.loginWithToken(config.token) : client.login(config.email, config.password);

// -- Global Variables -------------------------------------------------------------------------------------------------

global.bot = { // Kids, don't ever do this... It's usually a bad idea.
	client,
	admin,
	commands,
	config,
	loadConfigFile,
	saveConfigFile
}
