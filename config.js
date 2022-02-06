const nconf = require("nconf");

nconf.use("file", { file: "./config.json" });

exports.get = (key) => {
	return nconf.get(key);
};

exports.update = (key, value) => {
	nconf.load();
	nconf.set(key, value, console.log);
	nconf.save();
};
