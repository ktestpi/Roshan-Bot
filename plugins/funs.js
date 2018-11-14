const { Plugin } = require('aghanim')
const util = require('erisjs-utils')
const { Message, Guild } = require('erisjs-utils')

module.exports = class Funcs extends Plugin {
    constructor(client, options) {
        super(client)
    }
    wrongCmd(msg, list, prefix) {
        const options = Object.keys(list).sort()
        // throw new 
        // return msg.replyDM(this.locale.replacer(this.locale.getUserString(msg,'wrongCommandArgumment'), {})`:x: **Opciones disponibles** para \`${prefix}\`\n\n|${options.filter(o => o).map(o => `\`${o}\``).join(', ')}|`)
        // return msg.replyDM(`:x: **Opciones disponibles** para \`${prefix}\`\n\n|${options.filter(o => o).map(o => `\`${o}\``).join(', ')}|`)
    }
    
}