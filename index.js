const fs = require('fs');
const child = require('child_process');

function InstallPackages() {
	console.log('Вы не установили сначала необходимые пакеты node!')
	console.log('Пожалуйста, подождите... начинается установка всех необходимых пакетов node с помощью дочернего процесса')
	console.log('Если бот не может установить пакет, пожалуйста, установите его вручную')
	try {
		child.execSync('npm i')
		console.log('Установка завершена! Пожалуйста, выполните команду "node index" снова!')
		process.exit()
	} catch (err) {
		console.log('Ошибка! ', err)
		console.log('Сервер поддержки: https://discord.gg/zv6maQRah3')
		process.exit()
	}
}

if (Number(process.version.split('.')[0]) < 16) {
	console.log('Неверная версия NodeJS!, Пожалуйста, используйте NodeJS 16.x или выше')
	process.exit()
}
if (fs.existsSync('./node_modules')) {
	if (fs.existsSync('./node_modules/discord.js')) {
		const check = require('./node_modules/discord.js/package.json')
		if (Number(check.version.split('.')[0]) !== 14) {
			console.log('Неверная версия Discord.JS!, Пожалуйста, используйте Discord.JS 14.x')
			process.exit()
		}
	} else InstallPackages()
	if (fs.existsSync('./node_modules/axios')) {
		const check = require('./node_modules/axios/package.json')
		if (Number(check.version.split('.')[1]) > 1) {
			console.log('Неверная версия Axios! Пожалуйста, используйте Axios 1.1.3')
			process.exit()
		}
	} else InstallPackages()
	if (fs.existsSync('./node_modules/chalk')) {
		const check = require('./node_modules/chalk/package.json')
		if (Number(check.version.split('.')[0]) > 4) {
			console.log('Неверная версия Chalk!, Пожалуйста, используйте Chalk 4.1.2')
			process.exit()
		}
	} else InstallPackages()
	if (!fs.existsSync('./node_modules/js-yaml')) InstallPackages()
} else InstallPackages()

const chalk = require('chalk');
const yaml = require('js-yaml');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));

if (client.config.panel.adminkey || client.config.resource || client.config.message.image) {
	console.log(chalk.cyan('[PteroStats] ') + chalk.red('Вы используете старый файл конфигурации, пожалуйста, обновите ваш файл конфигурации по адресу ') + chalk.green('https://github.com/HirziDevs/PteroStats/blob/main/config.yml'))
	process.exit()
}
if (client.config.token.startsWith('Put') || !client.config.token.length) {
	console.log(chalk.cyan('[PteroStats] ') + chalk.red('Ошибка! Неверный токен бота Discord'))
	process.exit()
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(client.config.token);