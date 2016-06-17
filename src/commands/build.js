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
			"url" : `https://raw.githubusercontent.com/ESWAT/stormchaser/master/data/herotalentbuilds.json`,
			"json" : true
		}, (error, response, body) => {
			if (error) console.log("[Build]", error);

			else {
				let each = _.forEach(body, function(value, key) {
					console.log('value ' , value);
				});
			}
			/*else {

				let count = 0;
				let flag = false;
				let result = '';
				let each = _.forEach(body, function(value, key) {
					count++;
					if (value.name === params.join(' ')){
						flag = true;
				  		console.log(value);
				  		console.log(value.abilities[value.id]);
				  		
						result += `\n${value.name}`;
						result += `\nHP: ${value.stats[value.id].hp} :heart: /MP: ${value.stats[value.id].mana} :droplet:`;
						result += `\nAbilities:`;
						_.forEach(value.abilities[value.id], function(value_sk, key) {
							result += `\n**${value_sk.name}:** ${value_sk.description}`;
							if (!value_sk.trait){
								result += `\n 	Mana Cost: ${value_sk.manaCost}`;
								result += `\n 	CD: ⏰ ${value_sk.cooldown} secs`;								
							}
						});
					}
					if (count === body.length && flag) global.bot.client.sendMessage(message, result);
					else if (count === body.length && !flag) global.bot.client.sendMessage(message, `No results found for "${params.join(' ')}".`);
				});
			}*/
		});

    }

}

// -- Export Variables -------------------------------------------------------------------------------------------------

module.exports = Hero;
