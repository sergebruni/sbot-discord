"use strict"; // Required by Node for ES6

// -- Node Modules -----------------------------------------------------------------------------------------------------

const request = require("request");

// -- Local Variables --------------------------------------------------------------------------------------------------

const Command = require(__dirname + "/../command.js");

// -- Monster Command -----------------------------------------------------------------------------------------------------

class Monster extends Command {

    constructor() {
        super("Monster");
        this.aliases     = ["Monsters", "LookupMonster"];
        this.description = "Lookup a monster on tosdb.org";
        this.usage       = "<monster name>";
    }

    execute(message) {

        let params = this.getParams(message);

    request({
      "method" : "GET",
      "url" : `http://tosdb.org/api/monsters/search.php?format=json&q=${params.join("%20")}`,
      "json" : true
    }, (error, response, body) => {
      if (error) console.log("[Item]", error);
      else if (body.found > 0) {
        let results = `${body.found} result(s) found for "${params.join(' ')}" :`;
        for (let result of body.results) {
          results += `\n - ${result.name}: ${result.link}`;
        }
        if (body.results.length < body.found) {
          results += `\nand ${body.found - body.results.length} more result(s) not shown.`
        }
        global.bot.client.sendMessage(message, results);
      }
      else {
        global.bot.client.sendMessage(message, `No results found for "${params.join(' ')}".`);
      }
    });

    }

}

// -- Export Variables -------------------------------------------------------------------------------------------------

module.exports = Monster;