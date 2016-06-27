var config = {};

config.game= process.env.GAME;
config.email = process.env.EMAIL;
config.password=  process.env.PASS;
config.commandPrefix= process.env.COMMPREFIX;
config.updateChannel= process.env.UPCHANNEL;
config.newsEnabled= true;
config.newsLatest= '';

module.exports = config;