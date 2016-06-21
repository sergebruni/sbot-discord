var config = {};

config.email = process.env.EMAIL;
config.password=  process.env.PASS;
config.commandPrefix= process.env.COMMPREFIX;

module.exports = config;