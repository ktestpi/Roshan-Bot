const Aghanim = require('aghanim')
const path = require('path')

//Initialize Bot with Aghanim Command Client
const bot = new Aghanim(process.env.BOT_TOKEN || require('./env.json').BOT_TOKEN)

bot.commandArgsMiddleware = function(args, msg){
	// args.user = {}
	// args.user.supporter = bot.components.Users.isSupporter(msg.author.id)
	// args.user.betatester = bot.components.Users.isBetatester(msg.author.id)
	// args.user.lang = bot.locale.getUserStrings(msg)
	// args.user.langstring = key => args.user.lang[key] || ''
	// args.user.locale = (langString,replacements) => args.replacer(args.user.lang[langString] || langString, replacements) 
	// args.user.langFlag = bot.locale.getUserLang(msg)
	// args.replacer = bot.locale.replacer.bind(bot.locale)
}

//Define categories for commands
const categoryCommands = [
	{ name: 'General', description: 'Ayuda de general'},
	{ name: 'Dota 2', description: 'Ayuda de Dota 2'},
	{ name: 'Account', description: 'Ayuda para la gestión de la cuenta en Roshan'},
	{ name: 'Server', description: 'Ayuda para comandos de servidor'},
	{ name: 'Owner', description: 'Ayuda para comandos de propietario'},
	{ name: 'Fun', description: 'Ayuda para comandos de emojis y memes'},
	{ name: 'Artifact', description: 'Ayuda los comandos de Artifact'},
]

categoryCommands.forEach(category =>
	bot.addCategory(category.name, category.description)
)

//Load commands
const commandsDirs = ['commands/opendota', 'commands/account', 'commands/server', 'commands/general',
	'commands/fun', 'commands/owner', 'commands/dota2', 'commands/playercard', 'commands/artifact']

commandsDirs.forEach(dir =>
	bot.addCommandDir(path.join(__dirname, dir))
)

// Load components
bot.addComponentDir(path.join(__dirname, 'components'))

function filterCommands(cmd,query,owner){
	if(query === 'owner'){
	return owner
	}
	return !cmd.hide
}

// Adding help command
bot.addCommand(new Aghanim.Command('help',{}, async function(msg, args, client, command){
	const categories = client.categories.map(c => c.name.toLowerCase())
	const query = args.from(1).toLowerCase();
	const lang = client.locale.getUserStrings(msg)
	const owner = msg.author.id === bot.owner.id
	if(query === 'owner' && !owner){return}
	let helpMessage = lang['help.message'] +'\n\n'
	if(categories.includes(query)){
	const cmds = client.getCommandsFromCategories(query).sort((a, b) => a.name > b.name ? 1 : -1)
	const prefix = client.defaultPrefix
	if(!cmds){helpMessage += client.categories.filter(c => !c.hide).map(c => `**${c.name}** \`${client.defaultPrefix}help ${c.name.toLowerCase()}\` - ${client.locale.getCat(c.name,msg)}`).join('\n') + '\n\n' + lang['help.messageaftercategories']}
	else{
		helpMessage += cmds.filter(c => filterCommands(c,query,owner)).map(c => {
		const langCmd = client.locale.getCmd(c.name,msg)
		return `\`${prefix}${c.name}${langCmd.args ? ' ' + langCmd.args : ''}\` - ${langCmd.help || c.help}${c.subcommands.length ? '\n' + c.subcommands.filter(s => filterCommands(s,query,owner)).map(s => {
			const langCmd = client.locale.getCmd(c.name + '_' + s.name,msg)
			return `  · \`${s.name}${langCmd.args ? ' ' + langCmd.args : ''}\` - ${langCmd.help}`}).join('\n') : ''}`
		}).join('\n')
	}
	}else{
	helpMessage += client.categories.filter(c => !c.hide).map(c => `**${c.name}** \`${client.defaultPrefix}help ${c.name.toLowerCase()}\` - ${client.locale.getCat(c.name,msg)}`).join('\n') + '\n\n' + lang['help.messageaftercategories']
	}
	if(!client.setup.helpDM){
	return msg.reply(helpMessage)
	}else{
	return msg.replyDM(helpMessage)
	}
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