"use strict"; // Required by Node for ES6

// -- Node Modules -----------------------------------------------------------------------------------------------------

const request  = require("request");

// -- Local Variables --------------------------------------------------------------------------------------------------

const Command = require(__dirname + "/../command.js");

// -- Github Command ---------------------------------------------------------------------------------------------------

class Github extends Command {

	constructor() {
		super("Github");
		this.description = "Add/Remove repos in the Github updates feed.";
		this.usage       = "<add/remove> <repo link>";
		this.queue       = [];
		setInterval(this.poll.bind(this), 60000); // poll once per minute
	}

	execute(message) {

        let params   = this.getParams(message);
        let response = "An unknown error occured!";

        if (params.length !== 2 || params[0] != "add" && params[0] != "remove") {
        	return global.bot.client.sendMessage(message, "Missing parameters.");
        }

        let githubRegEx = /^http(?:s?):\/\/github\.com\/([a-zA-Z0-9-]+\/[a-zA-Z0-9-]+)?$/g;
        let link = githubRegEx.exec(params[1]);
        if (!link[1]) return global.bot.client.sendMessage(message, "Invalid link.");

        if (params[0] === "add") {

			global.bot.config.githubSubscriptions.push({
				"repo" : link[1],
				"etag" : "",
				"latest" : ""
			});

			response = `Successfully added "${link[1]}"`;
			console.log(`[Github] Added "${link[1]}" to subscriptions.`)

		}

		else if (params[0] === "remove") {

			for (let i = 0; i < global.bot.config.githubSubscriptions.length; ++i) {
				if (global.bot.config.githubSubscriptions[i].repo === link[1]) {
					global.bot.config.githubSubscriptions.splice(i, 1);
				}
			}

			response = `Successfully removed "${link[1]}"`;
			console.log(`[Github] Removed "${link[1]}" from subscriptions.`)

		}

		global.bot.client.sendMessage(message, response);
		return this.poll();

	}

	poll() {

		// save newest etags & ids
		global.bot.saveConfigFile();

		// send any messages in the queue
		if (this.queue.length) this.sendQueue();

		// check to make sure we have at least one subscription
		if (!global.bot.config.githubSubscriptions) return;

		// check for repo changes and add them to the next queue
		for (let subscription of global.bot.config.githubSubscriptions) {
			request({
				"method" : "GET",
				"url" : `https://api.github.com/repos/${subscription.repo}/events`,
				"json" : true,
				"headers" : {
					"Accept" : "application/vnd.github.v3+json",
					"If-None-Match" : subscription.etag,
					"User-Agent" : "Cmdr. LoadFail"
				}
			}, (error, response, body) => {
				if (error) return console.log("[Github]", error);
				else if (response.statusCode === 304) return; // github responded with no changes
				else if (body) { // request() response contains some json... probably has changes
					if (response.headers.etag) subscription.etag = response.headers.etag;
					else return console.log(`[Github] No ETag header found for "${subscription.repo}"!`);
					this.createQueue(subscription, body);
				}
			});
		}

	}

	sendQueue() {
		console.log(`[Github] Sending ${this.queue.length} new messages.`);
		while (this.queue.length) {
			let message = this.queue.pop();
			global.bot.client.sendMessage(global.bot.config.updateChannel, message);
		}
	}

	createQueue(subscription, events) {
		for (let event of events) {
			if (event.id === subscription.latest) break; // only queue new changes
			if (event.type === "PullRequestEvent" && event.payload.action === "opened") {
				this.queue.push(templates.pullRequest(event));
			}
			else if (event.type === "IssuesEvent" && event.payload.action === "opened") {
				this.queue.push(templates.issue(event));
			}
			else if (event.type === "ReleaseEvent" && event.payload.action === "published") {
				this.queue.push(templates.release(event));
			}
			else if (event.type === "PushEvent" && event.payload.size > 1) {
				this.queue.push(templates.pushMulti(event));
			}
			else if (event.type === "PushEvent" && event.payload.size === 1) {
				this.queue.push(templates.push(event));
			}
		}
		subscription.latest = events[0].id; // store the latest id
	}

}

// -- Event Templates --------------------------------------------------------------------------------------------------

const templates = {
	pullRequest : function(event) {
		let repo = event.repo.name;
		let user = event.payload.pull_request.user.login;
		let url = `https://github.com/${repo}/pull/${event.payload.number}`;
		let content = `**[${repo}]** — New pull request from ${user}:`;
		content += `\n${url}`;
		return content;
	},
	issue : function(event) {
		let repo = event.repo.name;
		let user = event.payload.issue.user.login;
		let url = `https://github.com/${repo}/issues/${event.payload.issue.number}`;
		let content = `**[${repo}]** — New issue opened by ${user}:`;
		content += `\n${url}`;
		return content;
	},
	release : function(event) {
		let repo = event.repo.name;
		let tag = event.payload.release.tag_name;
		let url = `https://github.com/${repo}/releases/${tag}`;
		let content = `**[${repo}]** — New release:`;
		content += `\n${url}`;
		return content;
	},
	pushMulti : function(event) {
		let repo = event.repo.name;
		let before = event.payload.before.substring(0, 10);
		let head = event.payload.head.substring(0, 10);
		let url = `https://github.com/${repo}/compare/${before}...${head}`;
		let content = `**[${repo}]** — ${event.payload.size} new commits:`;
		content += `\n${url}`;
		return content;
	},
	push : function(event) {
		let repo = event.repo.name;
		let commit = event.payload.commits[0];
		let sha = commit.sha.substring(0, 10);
		let url = `https://github.com/${repo}/commit/${sha}`;
		let content = `**[${repo}]** — 1 new commit:`;
		content += `\n${url}`;
		return content;
	}
}

// -- Export Variables -------------------------------------------------------------------------------------------------

module.exports = Github;
