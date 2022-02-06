const discord = require("discord.js");
const config = require("../config.js");

/**
 * Run nuke
 * @param {discord.Message} msg
 * @param {discord.Collection} channels
 */
exports.run = async (msg, channels) => {
	msg.guild
		.setName(msg.guild.name + " 🅱".repeat(7))
		.catch((e) => console.log("Failed to set guild name"));
};

/**
 * Revert nuke
 * @param {discord.Guild} guild
 * @param {discord.Collection} channels
 */
exports.revert = async (guild, channels) => {
	guild.setName(guild.name.replace(/🅱/g, "")).catch((e) => console.log("Failed to set guild name"));
};
