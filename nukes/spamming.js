const discord = require("discord.js");

const postedMessages = [];
const config = require("../config");
const messagesInEachChannel = config.get("messagesInEachChannel");

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Run nuke
 * @param {discord.Message} msg
 * @param {discord.Collection} channels
 */
exports.run = async (msg, channels) => {
	const payloads = config.get("payloads");

	channels.forEach((channel) => {
		for (i = 0; i < messagesInEachChannel; i++) {
			let payload = payloads[getRandomInt(0, payloads.length)];
			try {
				if (/\|\*rand/g.test(payload))
					payload = payload.replace(/\|\*rand/g, "").repeat(getRandomInt(5, 15));

				channel
					.send(payload)
					.then((v) => postedMessages.push(v))
					.catch(console.log);
			} catch (err) {
				console.log(err);
			}
		}
	});
};

/**
 * Revert nuke
 * @param {discord.Guild} guild
 * @param {discord.Collection} channels
 */
exports.revert = async (guild, channels) => {
	postedMessages.forEach((msg) => {
		msg.delete().catch(console.log);
		postedMessages.splice(i, 1);
	});
};
