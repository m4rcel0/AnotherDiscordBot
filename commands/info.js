// UNFINISHED
// Need more details/fields

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get user or server info.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('User Information.')
				.addUserOption(option => option.setName('target').setDescription('The user')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Server Information.')),
	async execute(interaction) {

		if (interaction.options.getSubcommand() === 'user') {
			let user = interaction.options.getUser('target');
			if (!user) { user = interaction.user; }
			const member = await interaction.guild.members.fetch(user.id);
			const embed = new MessageEmbed()
				.setColor(member.displayHexColor)
				.setAuthor(`User info - ${member.user.tag}`)
				.setThumbnail(member.user.displayAvatarURL())
				.addField('Account created:', `<t:${parseInt(member.user.createdTimestamp / 1000)}:D>`)
				.addField('Joined this server:', `<t:${parseInt(member.joinedTimestamp / 1000)}:D>`);
			await interaction.reply({ embeds: [embed] });
		}

		else if (interaction.options.getSubcommand() === 'server') {
			const guild = interaction.guild;
			const embed = new MessageEmbed()
				.setColor('ffffff')
				.setAuthor(guild.name)
				.addField('Created on:', `<t:${parseInt(guild.createdTimestamp / 1000)}:D>`)
				.addField('Members:', String(guild.memberCount));
			await interaction.reply({ embeds: [embed] });
		}

	},
};

