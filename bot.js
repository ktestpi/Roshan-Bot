const Aghanim = require('aghanim')
const path = require('path')
require('dotenv').config()
//Initialize Bot with Aghanim Command Client
const bot = new Aghanim(process.env.BOT_TOKEN)

Object.defineProperty(bot, "isProduction", {
	get: () => process.env.NODE_ENV === "production"
})

//Define categories for commands
const categoryCommands = [
	{ name: 'General', description: 'Ayuda de general'},
	{ name: 'Dota 2', description: 'Ayuda de Dota 2'},
	{ name: 'Account', description: 'Ayuda para la gestión de la cuenta en Roshan'},
	{ name: 'Server', description: 'Ayuda para comandos de servidor'},
	{ name: 'Owner', description: 'Ayuda para comandos de propietario'},
	{ name: 'Fun', description: 'Ayuda para comandos de emojis y memes'},
	{ name: 'Artifact', description: 'Ayuda los comandos de Artifact'},
	// { name: 'Underlords', description: 'Ayuda los comandos de Dota Underlords' },
]

categoryCommands.forEach(category =>
	bot.addCategory(category.name, category.description)
)

// Load components
bot.addComponentDir(path.join(__dirname, 'components'))
bot.addComponentFile(path.join(__dirname, 'seasonal/duel/duel.component'))

//Load commands
const commandsDirs = ['commands/opendota', 'commands/account', 'commands/server', 'commands/general',
	'commands/fun', 'commands/owner', 'commands/dota2', 'commands/playercard', 'commands/artifact', 'commands/underlords']

commandsDirs.forEach(dir =>
	bot.addCommandDir(path.join(__dirname, dir))
)


function filterCommands(cmd,query,owner){
	if(query === 'owner'){
		return owner
	}
	return !cmd.hide
}

// Adding help command
bot.addCommand(new Aghanim.Command('help',{}, async function(msg, args, client, command){
	const categories = client.categories.map(c => c.name.toLowerCase())
	const query = args.from(1).toLowerCase()
	const owner = msg.author.id === bot.owner.id
	if(query === 'owner' && !owner){return}
	let helpMessage = msg.author.locale('help.message') +'\n\n'
	if(categories.includes(query)){
	const cmds = client.getCommandsOfCategories(query).sort((a, b) => a.name > b.name ? 1 : -1)
	const prefix = client.prefix
	if(!cmds){helpMessage += client.categories.filter(c => !c.hide).map(c => `**${c.name}** \`${client.prefix}help ${c.name.toLowerCase()}\` - ${msg.author.locale('cat_' + c.name.toLowerCase() + '_help')}`).join('\n') + '\n\n' + msg.author.locale('help.messageaftercategories')}
	else{
		helpMessage += cmds.filter(c => filterCommands(c,query,owner)).map(c => {
			const cmd_args = msg.author.locale('cmd_' + c.name + '_args')
			const cmd_help = msg.author.locale('cmd_' + c.name + '_help')
			// const langCmd = client.components.Locale.getCmd(c.name,msg)
			return `\`${prefix}${c.name}${cmd_args ? ' ' + cmd_args : ''}\` - ${cmd_help || c.help}${c.childs.length ? '\n' + c.childs.filter(s => filterCommands(s,query,owner)).map(s => {
				const cmd_args = msg.author.locale('cmd_' + c.name + '_' + s.name + '_args')
				const cmd_help = msg.author.locale('cmd_' + c.name + '_' + s.name + '_help')
				// const langCmd = client.components.Locale.getCmd(c.name + '_' + s.name,msg)
				return `  · \`${s.name}${cmd_args ? ' ' + cmd_args : ''}\` - ${cmd_help}`}).join('\n') : ''}`
			}).join('\n')
		}
	}else{
		helpMessage += client.categories.filter(c => !c.hide).map(c => `**${c.name}** \`${client.prefix}help ${c.name.toLowerCase()}\` - ${msg.author.locale('cat_' + c.name.toLowerCase() + '_help')}`).join('\n') + '\n\n' + msg.author.locale('help.messageaftercategories')
	}
	return !client.setup.helpDM ? msg.reply(helpMessage) : msg.replyDM(helpMessage)

}))

process.on('unhandledRejection', (reason, p) => {
	Promise.resolve(p).then((val) => {
		bot.emit('error', new Error(`Unhandled Rejection at: ${val}\n${reason}`))
	}).catch((err) => {
		bot.emit('error', new Error(`Unhandled Rejection Rejected at: ${err.stack}\n${reason}`))
	})
	// application specific logging, throwing an error, or other logic here
})

process.on('unhandledRejection', r => console.log(r))

bot.connect()