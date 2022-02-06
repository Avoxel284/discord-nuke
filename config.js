const nconf = require("nconf");
const fs = require("fs")
const chalk = require("chalk")

if (!fs.existsSync("./config.json")){
	console.log(chalk.redBright(`config.json does not exist!`))
	process.exit(1)
}
nconf.use("file", { file: "./config.json" });

exports.get = (key) => {
	return nconf.get(key);
};

exports.update = (key, value) => {
	nconf.load();
	nconf.set(key, value, console.log);
	nconf.save();
};
