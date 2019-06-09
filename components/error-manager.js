const CustomComponent = require('../classes/custom-component.js')
const { UserError, ConsoleError, CommandError} =require('../classes/errors')

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
        this.client.on('aghanim:command:error', (error, msg, args, command) => {
            if (error instanceof UserError) {
                msg.reply(error.reply(msg, args))
                if (this.config.userSilent && !error.err) { return }
                this.console(error.toConsole(msg, args, command))
            } else if (error instanceof ConsoleError) {
                this.console(error.toConsole(msg, args, command))
            } else {
                msg.reply(new UserError('Unknown', 'error.unknown', error).reply(msg, args))
                this.console(new CommandError('Command', error).toConsole(msg, args, command))
            }
        })

        this.client.on('aghanim:component:error', (error, component) => {
            this.console(new ComponentError('Component', error).toConsole(component))
        })

        this.client.on('aghanim:error:', (error) => {
            this.errorToConsole(error)
        })

        this.client.on('error', (error) => {
            // this.console(`\`\`\`${error.stack}\`\`\``)
            this.errorToConsole(error)
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
    errorToConsole(error) {
        this.console(new ConsoleError('ND', error.message, error).toConsole())
    }
}