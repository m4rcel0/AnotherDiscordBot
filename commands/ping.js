const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Get bot\'s latency to Discord.'),
	async execute(interaction) {
		await interaction.reply('🏓 Pong!');
		const pong = await interaction.fetchReply();
		const delay = pong.createdTimestamp - interaction.createdTimestamp;
		pong.edit(`🏓 Pong! \`${delay}ms\``);
	},
};
