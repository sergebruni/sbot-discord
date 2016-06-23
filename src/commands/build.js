"use strict"; // Required by Node for ES6

// -- Node Modules ---------------------------------------------------------------------------Hero--------------------------

const request = require("request");
const _ = require("lodash");

// -- Local Variables --------------------------------------------------------------------------------------------------

const Command = require(__dirname + "/../command.js");

// -- Hero Command -----------------------------------------------------------------------------------------------------

class Hero extends Command {

    constructor() {
        super("Build");
        this.aliases     = ["Build", "Builds"];
        this.description = "Lookup an build on tosdb.org";
        this.usage       = "<build heroname>";
    }

    execute(message) {

        let params = this.getParams(message);

		request({
			"method" : "GET",
			"url" : `https://hotsbuildsjson.herokuapp.com/hotsbuilds`,
			"json" : true
		}, (error, response, body) => {
			if (error) console.log("[Build]", error);

			else {
				var heroname = params.join(' ');
				if (_.isUndefined(body.builds[heroname]))
					global.bot.client.sendMessage(message, `No results found for "${params.join(' ')}".`);
				else {
					var builds = body.builds[heroname]
					
					var result = `\n${heroname}`;
					result += `\n=======================================`;
					result += `\nLv01: ${builds.build1.lv01}`;
					result += `\nLv04: ${builds.build1.lv04}`;
					result += `\nLv07: ${builds.build1.lv07}`;
					result += `\nLv10: ${builds.build1.lv10}`;
					result += `\nLv13: ${builds.build1.lv13}`;
					result += `\nLv16: ${builds.build1.lv16}`;
					result += `\nLv20: ${builds.build1.lv20}`;
					result += `\n=======================================`;
					result += `\nLv01: ${builds.build2.lv01}`;
					result += `\nLv04: ${builds.build2.lv04}`;
					result += `\nLv07: ${builds.build2.lv07}`;
					result += `\nLv10: ${builds.build2.lv10}`;
					result += `\nLv13: ${builds.build2.lv13}`;
					result += `\nLv16: ${builds.build2.lv16}`;
					result += `\nLv20: ${builds.build2.lv20}`;			
					global.bot.client.sendMessage(message, result);		
				}

			}
		});
    }

}

// -- Export Variables -------------------------------------------------------------------------------------------------

module.exports = Hero;
