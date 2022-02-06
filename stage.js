const discord = require("discord.js");
const discordVoice = require("@discordjs/voice");

const createdChannels = [];
const config = require("./config");
const path = require("path");
const axios = require("axios").default;

/**
 * Run nuke
 * @param {discord.Message} msg
 * @param {Array} channels
 */
exports.run = async (msg, channels) => {
	try {
		
	} catch (error) {
		console.error(error);
	}
};

/**
 * Revert nuke
 * @param {discord.Guild} guild
 * @param {Array} channels
 */
exports.revert = async (guild, channels) => {
	createdChannels.forEach((channel) => channel.delete().catch(console.error));
};
