const { ActivityType } = require('discord.js')
const chalk = require('chalk')
const checkStatus = require('../handlers/checkStatus')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(chalk.cyan('[PteroStats] ') + chalk.green('Бот запущен!'))
		console.log(chalk.cyan('[PteroStats] ') + chalk.green('Если вам нужна поддержка, вы можете присоединиться к нашему серверу Discord https://discord.gg/zv6maQRah3'))
		console.log(chalk.cyan('[PteroStats] ') + chalk.yellow('Если какая-то из нод находится в режиме онлайн, но вложение считывается как автономное, включите функцию ') + chalk.green('log_error') + chalk.yellow(' в конфигурационном файле и сообщите об этом в https://discord.gg/zv6maQRah3'))

		if (client.guilds.cache.size < 1) return console.log(chalk.cyan('[PteroStats] ') + chalk.red('Ошибка! Этого бота нет ни на одном из серверов Discord'))
		if (client.config.timeout < 1) {
			console.log(chalk.cyan('[PteroStats] ') + chalk.red('Тайм-аут не может быть меньше 1 секунды!'))
			client.config.timeout = 1
		}

		if (client.config.refresh > 1 && client.config.refresh < 10) console.log(chalk.cyan('[PteroStats] ') + chalk.red('Время обновления менее 10 секунд не рекомендуется!'))
		else if (client.config.refresh < 1) {
			console.log(chalk.cyan('[PteroStats] ') + chalk.red('Время обновления не может быть меньше 1 секунды!'))
			client.config.refresh = 10
		}

		if (client.config.presence.text && client.config.presence.type) {
			switch (client.config.presence.type.toLowerCase()) {
				case 'playing':
					client.config.presence.type = ActivityType.Playing
					break;
				case 'listening':
					client.config.presence.type = ActivityType.Listening
					break;
				case 'competing':
					client.config.presence.type = ActivityType.Competing
					break;
				default:
					client.config.presence.type = ActivityType.Watching
			}

			client.user.setActivity(client.config.presence.text, { type: client.config.presence.type })
		}

		if (client.config.presence.status) {
			if (!['idle', 'online', 'dnd', 'invisible'].includes(client.config.presence.status.toLowerCase())) client.config.presence.status = 'online'

			client.user.setStatus(client.config.presence.status);
		}

		checkStatus({ client: client })

		setInterval(() => {
			checkStatus({ client: client })
		}, client.config.refresh * 1000)
	}
}