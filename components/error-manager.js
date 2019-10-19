const CustomComponent = require('../classes/custom-component.js')

module.exports = class ErrorManager extends CustomComponent() {
    constructor(client, options) {
        super(client)
        // Setup
        this.channel = this.client.config.console.channel
        this.errors = {}
        this.eventEmit = 'error'
        this.icons = {
            opendota: '🎮❌'
        }
        this.config = { userSilent: true }

        // Events
        this.client.on('aghanim:command:error', (error, msg, args, client, command) => {
            const embed = {
                title: `:x: Command Error: ${command.name}`,
                author: { name: `${msg.author.username} - ${msg.author.id}`, icon_url: msg.author.avatarURL },
                fields: [
                    { name: 'Command Content', value: this.toCode(msg.content), inline: false },
                    { name: 'Error Message', value: this.toCode(error.stack), inline: false }],
                footer: { text: `Error: ${command.name || 'ND'}` }
            }
            // if (error) {
            //     embed.fields.push({ name: 'Stack', value: this.toCode(this.err.stack), inline: false })
            // }
            this.console( { embed } )
            msg.reply('error.unknown')
        })

        this.client.on('aghanim:component:error', (error, event, client, component) => {
            const embed = {
                title: `:x: Component Error: ${component.constructor.name}`,
                fields: [
                    // { name: 'Command Content', value: this.toCode(msg.content), inline: false },
                    { name: 'Error Message', value: this.toCode(error.stack), inline: false }],
                footer: { text: `Error: ${component.constructor.name || 'ND'}` }
            }
            // if (error) {
            //     embed.fields.push({ name: 'Stack', value: this.toCode(error.stack), inline: false })
            // }
            this.console( { embed } )
        })

        this.client.on('aghanim:error', (error, client) => {
            const embed = {
                title: `:x: Bot Error: ${error.message}`,
                fields: [
                    // { name: 'Command Content', value: this.toCode(msg.content), inline: false },
                    { name: 'Error Message', value: this.toCode(error.stack), inline: false }],
                footer: { text: `Error` }
            }
           this.console( { embed } )
        })
    }
    emit(error) {
        this.client.emit(this.eventEmit, error)
    }
    send(channel, message) {
        return this.client.createMessage(channel, message)
    }
    console(message) {
        return this.send(this.channel, message)
    }
    reply(msg, message) {
        return this.send(msg.channel.id, message)
    }
    toCode(string) {
        return `\`\`\`${string.slice(0,1000)}\`\`\``
    }
}