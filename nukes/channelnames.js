const discord = require("discord.js");
const config = require("../config.js");

/**
 * Run nuke
 * @param {discord.Message} msg
 * @param {discord.Collection} channels
 */
exports.run = async (msg, channels) => {
	channels.forEach((channel) => {
		channel.setName(channel.name + "🅱".repeat(7)).catch(console.log);
	});
};

/**
 * Revert nuke
 * @param {discord.Guild} guild
 * @param {discord.Collection} channels
 */
exports.revert = async (guild, channels) => {
	channels.forEach((channel) => {
		channel.setName(channel.name.replace(/🅱/g, "")).catch(console.log);
	});
};
