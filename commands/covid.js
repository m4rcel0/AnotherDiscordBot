const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const numeral = require('numeral');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('covid')
		.setDescription('Covid information')
		.addStringOption(option => option.setName('country').setDescription('Country to check covid information')),
	async execute(interaction) {
		const baseUrl = 'https://disease.sh/v3/covid-19/';
		const yesterdayUrl = '/?yesterday=true';
		const ereyesterdayURL = '/?twoDaysAgo=true';
		let countryFlag = null;
		let country = interaction.options.getString('country');
		if (country) {
			country = 'countries/' + country.toLowerCase();
		}
		else {
			country = 'all';
			countryFlag = 'https://i.imgur.com/MZE64au.png';
		}
		const today = baseUrl + country;
		const yesterday = baseUrl + country + yesterdayUrl;
		const ereyesterday = baseUrl + country + ereyesterdayURL;

		const options = { method: 'Get' };
		const todayData = await fetch(today, options).then(res => res.json());
		const yesterdayData = await fetch(yesterday, options).then(res => res.json());
		const ereyesterdayData = await fetch(ereyesterday, options).then(res => res.json());

		let title;
		if (!countryFlag) {
			countryFlag = todayData.countryInfo.flag;
			title = todayData.country;
		}
		else {
			title = 'World';
		}

		const embed = createEmbed(todayData, yesterdayData, ereyesterdayData, countryFlag, title);

		await interaction.reply({ embeds: [embed] });


	},
};

function createEmbed(mainData, oneDayData, twoDayData, flag, title) {
	const embed = new MessageEmbed()
		.setTitle(title + ' COVID-19 information')
		.setURL('https://www.worldometers.info/coronavirus/' + (title === 'World' ? '' : 'country/' + title.toLowerCase()))
		.setFooter('Data from \'disease.sh\' → \'worldometers.info\'')
		.setColor('RED')
		.setThumbnail(flag)
		.addFields(
			{ name: 'TODAY', value: '­', inline: true },
			{ name: 'YESTERDAY', value: '­', inline: true },
			{ name: '2 DAYS AGO', value: '­', inline: true },
			{ name: 'Cases', value: formatNumber(mainData.todayCases) + '▲', inline: true },
			{ name: '­', value: formatNumber(oneDayData.todayCases), inline: true },
			{ name: '­', value: formatNumber(twoDayData.todayCases), inline: true },
			{ name: 'Deaths', value: formatNumber(mainData.todayDeaths) + '▲', inline: true },
			{ name: '­', value: formatNumber(oneDayData.todayDeaths), inline: true },
			{ name: '­', value: formatNumber(twoDayData.todayDeaths), inline: true },
			{ name: 'Recoveries', value: formatNumber(mainData.todayRecovered) + '▲', inline: true },
			{ name: '­', value: formatNumber(oneDayData.todayRecovered), inline: true },
			{ name: '­', value: formatNumber(twoDayData.todayRecovered), inline: true },
			{ name:'­­', value: '­' },
			{ name: 'Total Cases', value: formatNumber(mainData.cases), inline: true },
			{ name: 'Total Deaths', value: formatNumber(mainData.deaths), inline: true },
			{ name: 'Total Recoveries', value: formatNumber(mainData.recovered), inline: true },
			{ name: 'Active Cases', value: formatNumber(mainData.active), inline: true },
			{ name: 'Tests Used', value: formatNumber(mainData.tests), inline: true },
			{ name: 'Population', value: formatNumber(mainData.population), inline: true },
			{ name: 'Mortality', value: `${(mainData.deaths / mainData.cases * 100).toFixed(2)}%` },
			{ name: 'Updated:', value: `<t:${parseInt(mainData.updated / 1000)}:R>`, inline: false },
		);
	return embed;
}

function formatNumber(number) {
	if (number < 1000) {
		return String(number);
	}
	return numeral(number).format('0.00a').toUpperCase();
}