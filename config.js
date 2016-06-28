var config = {};

config.game= process.env.GAME;
config.email = process.env.EMAIL;
config.password=  process.env.PASS;
config.commandPrefix= process.env.COMMPREFIX;
config.updateChannel= process.env.UPCHANNEL;
config.updateGuildChannel= process.env.UPGCHANNEL;
config.newsEnabled= true;
config.newsLatest= '';

config.hotsList= ["Abathur", "Anub'arak", "Artanis", "Arthas", "Azmodan", "Brightwing", "Chen", "Cho", "Chromie", "Dehaka", "Diablo", "E.T.C.", "Falstad", "Gall", "Gazlowe", "Greymane", "Illidan", "Jaina", "Johanna", "Kael'thas", "Kerrigan", "Kharazim", "Leoric", "Li Li", "Li-Ming", "Lt. Morales", "Lunara", "Malfurion", "Medivh", "Muradin", "Murky", "Nazeebo", "Nova", "Raynor", "Rehgar", "Rexxar", "Sgt. Hammer", "Sonya", "Stitches", "Sylvanas", "Tassadar", "The Butcher", "The Lost Vikings", "Thrall", "Tracer", "Tychus", "Tyrael", "Tyrande", "Uther", "Valla", "Xul", "Zagara", "Zeratul"];

module.exports = config;