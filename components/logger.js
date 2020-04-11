const { Logger } = require('aghanim')

module.exports = {
	name: 'Logger',
	constructor: (client, options) => {
        // do something when create component instance
        this.channelID = client.config.console.channel
        this.client = client
        this.colors = {
            red: 16711680
        }
        this.logger = new Logger({
            label: 'Roshan',
            timestamps: true,
            levels: {
                ready: {style: 'cyan'},
                dev: { style: 'magenta' },
                eval: { style: 'cyan' }
            },
            // ignoredLevels: [this.devLogs ? '' : 'dev']
        })
        this.client.logger = this.logger
        this.client.on('aghanim:command:prereq', (msg, args, client, command) => {
            this.logger.info(`cmd: ${command.name} - ${msg.author.username} (${msg.author.id})`)
            client.createMessage(this.channelID, {
                embed: {
                    title: `cmd: ${command.name}`,
                    author: { name: `${msg.author.username} - ${msg.author.id}`, icon_url: msg.author.avatarURL },
                    description: `${msg.channel.guild ? `**guild**: \`${msg.channel.guild.name}\` (\`${msg.channel.guild.id}\`)\n` : ''}**channel**: \`${msg.channel.name}\` (\`${msg.channel.id}\`)\n**content**: \`${args.content}\``
                }
            })
        })
        this.client.on('aghanim:command:error', (error, msg, args, client, command) => {
            this.logger.error(`cmd: ${command.name} - ${msg.author.username} (${msg.author.id})\n${error.message || error}`)
            client.createMessage(this.channelID, {
                content: client.config.roles.dev_errors,
                embed: {
                    title: `cmd: ${command.name}`,
                    author: { name: `${msg.author.username} - ${msg.author.id}`, icon_url: msg.author.avatarURL },
                    description: `${msg.channel.guild ? `**guild**: \`${msg.channel.guild.name}\` (\`${msg.channel.guild.id}\`)\n` : ''}**channel**: \`${msg.channel.name}\` (\`${msg.channel.id}\`)`,
                    fields: [
                        { name: 'Command content', value: toCode(msg.content), inline: false },
                        { name: 'Error message', value: toCode(error.message), inline: false }
                    ],
                    color: this.colors.red
                }
            })
            msg.reply('error.unknown')
        })
        this.client.on('aghanim:component:error', (error, event, client, component) => {
            this.logger.error(`component: ${component.name} - ${msg.author.username} (${msg.author.id})\n${error.message || error}`)
            client.createMessage({
                content: client.config.roles.dev_errors,
                embed: {
                    title: `component: ${component.constructor.name}`,
                    fields: [
                        { name: 'Error Message', value: toCode(error.message), inline: false },
                        { name: 'Error Stack', value: toCode(error.stack), inline: false }
                    ],
                    footer: { text: `Error: ${component.constructor.name || 'ND'}` },
                    color: this.colors.red
                }
             })
        })
        this.client.on('aghanim:error', (error, client) => {
            this.logger.error(`error: ${error.message || error}`)
            client.createMessage({
                content: client.config.roles.dev_errors,
                embed: {
                    title: `:x: Bot Error: ${error.message}`,
                    fields: [
                        { name: 'Error Message', value: toCode(error.message), inline: false },
                        { name: 'Error Stack', value: toCode(error.stack), inline: false }
                    ],
                    footer: { text: `Error` },
                    color: this.colors.red
                }
            })
        })
    },
    messageCreate(msg, client){
        client.logger.info('message: ' + msg.content)
    }
}

const toCode = (str) => {
    str = typeof str !== 'string' ? String(str) : str
    console.log(str)
    return `\`\`\`${str.substring(0,1000)}\`\`\``
}