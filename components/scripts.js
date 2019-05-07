const { Component } = require('aghanim')
const { inspect } = require('util')
module.exports = class Scripts extends Component {
    constructor(client, options) {
        super(client)
        this.client.scripts = {}
        this.client.modules_scripts = {}
        this.replChannel = "571165419977834506"
        this.scriptsChannel = "470189277544841226"
    }
    ready() {
        this.update()
    }
    messageCreate(msg) {
        if (msg.channel.id !== this.replChannel || msg.author.id !== this.client.owner.id || msg.content.startsWith(this.client.defaultPrefix)){return}
        const bot = this.client
        const _guild = msg.channel.guild
        const gval = eval
        
        const prequire = `const {${Object.keys(bot.scripts).join(', ')}}=bot.scripts;const {${Object.keys(bot.modules_scripts).join(', ')}}=bot.modules_scripts;function infos(name){
            return bot.scripts[name] && bot.scripts[name].description
        }`

        try {
            let toEval = msg.content
            const _message = msg
            const reply = msg.reply
            let result = eval(prequire+toEval)
            this.client.notifier.console('Eval', toEval)
            Promise.resolve(result).then(res => {
                if (typeof result === 'object') {
                    result = inspect(result)
                }
                result = String(result).slice(0, 1000)
                this.client.notifier.console('Eval Result', result)
                return msg.reply(`**${this.client.config.emojis.default.accept} Resultado**\n\`\`\`js\n${result}\`\`\``)
                // return msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.client.config.emojis.default.accept} Resultado**\n\`\`\`js\n${result}\`\`\``)
            }).catch(err => {
                this.client.notifier.console('Eval Error', err)
                return msg.reply(`**${this.client.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
                // return msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.client.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
            })
        } catch (err) {
            this.client.notifier.console('Code Error', err.stack)
            return msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.client.config.emojis.default.error} Code Error**\`\`\`js\n${err.stack}\`\`\``)
        }
    }
    update(){
        return new Promise((resolve, reject) => {
            this.client.scripts = {}
            this.client.modules_scripts = {}
            const bot = this.client
            this.client.getMessages(this.scriptsChannel).then(messages => {
                messages
                    .filter(m => m.content.startsWith('🇫'))
                    .map(m => ({ tag: m.content.match(/\*\*(\w+)\*\*/)[1], description: m.content.match(/\*\* - ([^\n]+)/)[1] || "", src: m.content.match(/\`\`\`js\n?([^]+)\n?\`\`\`/)[1] }))
                    .forEach(c => { 
                        try {
                            this.client.scripts[c.tag] = eval(`${c.src}`)
                            this.client.scripts[c.tag].description = c.description
                        } catch (err) {
                            this.client.notifier.console('Error loading script: ' + c.tag + '\n' + err.stack)
                        }
                    })

                    
            })
            this.client.getMessages(this.scriptsChannel).then(messages => {
                messages
                    .filter(m => m.content.startsWith('🇲'))
                    .map(m => ({ tag: m.content.match(/\*\*(\w+)\*\*/)[1], description: m.content.match(/\*\* - ([^\n]+)/)[1] || "", src: m.content.match(/\```js\n?([^]+)\n?```/)[1] }))
                    .forEach(c => {
                        try {
                            const src = `const obj = ${c.src};obj`
                            this.client.modules_scripts[c.tag] = eval(`${src}`)
                            this.client.modules_scripts[c.tag].description = c.description
                        } catch (err) {
                            this.client.notifier.console('Error loading modules_scripts: ' + c.tag + '\n' + err.stack)
                        }
                    })
            })
            this.client.notifier.console('Scripts', 'Loaded')
            resolve('Scripts loaded')
        })
    }
}
