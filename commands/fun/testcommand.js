const { Command } = require('aghanim')

class CustomCommand extends Command{
    constructor(...args){
        super(...args)
        this.response = args[1].response
    }
    process(msg, args, client, command){
        if (this.response) {
            return msg.channel.createMessage(this.response)
        }
    }
}

module.exports = new CustomCommand('cm', {
    category : 'Server', help : 'Muestra la configuración del servidor', args : '',
    response: 'Hi', rolesCanUse: 'aegis'},
    async (msg, args, client, command) => msg.reply('Hi cm')
    )