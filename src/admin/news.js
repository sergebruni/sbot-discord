"use strict"; // Required by Node for ES6

// -- Node Modules -----------------------------------------------------------------------------------------------------

const request  = require("request");

// -- Local Variables --------------------------------------------------------------------------------------------------

const Command = require(__dirname + "/../command.js");

// -- Steam Command ---------------------------------------------------------------------------------------------------

class News extends Command {

  constructor() {
    super("News");
    this.description = "Enable/Disable news update feed. (Leave empty to toggle.)";
    this.usage       = "<enable/disable>";
    this.queue       = [];
    setInterval(this.poll.bind(this), 5 * 60 * 1000); // poll once per 5 minutes
  }

  execute(message) {

        let params = this.getParams(message);
        let toggle = global.bot.config.newsEnabled;

        if (params[0] != "enable" && params[0] != "disable") toggle = !toggle;
        else if (params[0] === "enable") toggle = true;
    else if (params[0] === "disable") toggle = false;

    console.log(`[News] News feed set to "${toggle}".`)
    global.bot.client.sendMessage(message, `News feed set to "${toggle}".`);
    return this.poll();

  }

  poll() {

    // save newest id
    global.bot.saveConfigFile();

    // send any messages in the queue
    if (this.queue.length) this.sendQueue();

    // check to make sure news is enabled
    if (!global.bot.config.newsEnabled) return;

    // check for news updates and add them to the next queue
    request({
      "method" : "GET",
      "url" : "https://forum.treeofsavior.com/c/news.json",
      "json" : true
    }, (error, response, body) => {
      if (error) return console.log("[News]", error);
      else if (response.statusCode === 200) {
        let feed = body.topic_list.topics;
        feed.sort((a,b) => { return b.id - a.id });
        for (let item of feed) {
          if (item.id === global.bot.config.newsLatest) break; // only queue new news
          let url = `https://forum.treeofsavior.com/t/${item.slug}/${item.id}`;
          this.queue.push(`**${item.title}**:\n${url}`);
        }
        global.bot.config.newsLatest = feed[0].id; // store the latest id
      }
    });

  }

  sendQueue() {
    console.log(`[News] Sending ${this.queue.length} new messages.`);
    while (this.queue.length) {
      let message = this.queue.pop();
      global.bot.client.sendMessage(global.bot.config.updateChannel, message);
    }
  }

}

// -- Export Variables -------------------------------------------------------------------------------------------------

module.exports = News;