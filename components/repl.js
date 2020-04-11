const { Component } = require('aghanim')
const { inspect } = require('util')

module.exports = class Repl extends Component{
    constructor(client, options){
        super(client, options)
        this.enable = true
        this.replChannel = "571165419977834506"
        this.scriptsChannel = "470189277544841226"
    }
    ready(client){
        this.update()
    }
    messageCreate(msg, client){
        if(msg.channel.id === this.replChannel && !msg.author.bot && msg.author.id === msg.author.id !== this.client.owner.id){ 
            const response = msg.reply.bind(msg)
            response.table = (head, array) => response(head.join(' | ')+'\n'+array.map(el => el.join(' | ')).join('\n'))
            response.object = (obj) => response(`\`\`\`js\n${inspect(obj)}\`\`\``)
            response.keyval = (obj) => response(Object.keys(obj).map(key => `${key}: ${obj[key]}`).join('\n'))
            response.js = (obj) => response(`\`\`\`js\n${inspect(obj)}\`\`\``)
            
            let input = msg.content.split(' ')
            const { command, ctx } = parse(this.repl.commands, input)
            if(command){
                return Promise.resolve(command.run(ctx, client, response, command)).catch(response)
            }else{
                const client = this.client
                let result = eval(msg.content)
                Promise.resolve(result).then(res => {
                    if (typeof result === 'object') {
                        result = inspect(result)
                    }
                    result = String(result).slice(0, 1000)
                    this.client.logger.eval('Eval Result: ' + result)
                    return msg.reply(`**${this.client.config.emojis.default.accept} Result**\n\`\`\`js\n${result}\`\`\``)
                    // return msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.client.config.emojis.default.accept} Resultado**\n\`\`\`js\n${result}\`\`\``)
                }).catch(err => {
                    this.client.logger.eval('Eval Error: ' + err)
                    return msg.reply(`**${this.client.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
                    // return msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.client.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
                })

            }
        }
    }
    update(){
        const guild = new CommandRepl('guild', helpfunction)
        guild.register( 
            'list',
            (_, client, response) => response.table(['Name','Members'], client.guilds.map(g => [g.name, g.memberCount]))
        )
        guild.register('info',
            ([id], client, response) => {
                const guild = client.guilds.find(g => g.id === id || g.name.toLowerCase().includes(id))
                if(guild){
                    const {name, memberCount} = guild
                    return response.keyval({name, memberCount})
                }
            }
        )

        const user = new CommandRepl('user', helpfunction)
        user.register('info',
            ([id], client, response) => {
                const user = client.users.find(user => user.id === id || user.username.toLowerCase().includes(id))
                if(user){
                    const {username, id, mention} = user
                    return response.keyval({username, id, mention})
                }
            }
        )
        user.register('profile',
            ([id], client, response) => {
                return response.js(client.cache.profiles.get(id))
            }
        )
        user.register('opendota', async ([dotaID], client, response) => {
            const account = await this.client.components.Account.get(dotaID)
            if(account){
                return this.client.components.Opendota.request(['https://api.opendota.com/api/players/<id>'], account.dota).then(response.object)
            }else{
                return this.client.components.Opendota.request(['https://api.opendota.com/api/players/<id>'], dotaID).then(response.object)
            }
        })
        this.repl = new CommandRepl()
        this.repl.register(guild)
        this.repl.register(user)
        this.repl.register('refresh', (_, client, response) => this.update().then(() => response('Done refresh')))
        this.repl.register('help', (_, client, response) => response.table(["Command", "Description"], this.repl.commands.map(cmd => [cmd.name, ""])))
        return this.client.getMessages(this.scriptsChannel).then(messages => {
            const {exists, notExists } = messages
                .filter(m => m.content.startsWith('🇷'))
                .map(m => ({ tag: m.content.match(/\*\*(\w+)\*\*/)[1], description: m.content.match(/\*\* - ([^\n]+)/)[1] || "", src: m.content.match(/\`\`\`js\n?([^]+)\n?\`\`\`/)[1] }))
                .reduce((sum, cmd) => {
                    sum[this.repl.has(cmd.tag) ? 'exists': 'notExists'].push(cmd)
                    return sum
                },{exists: [], notExists: []})
            exists.forEach(c => {
                try{
                    const command = this.repl.commands.find(cmd => cmd.name === c.tag)
                    const src = eval(`const obj = ${c.src};obj`)
                    Object.keys(src).map(key => command.register(key, src[key]))
                }catch(err){
                    console.error(err)
                }
            })
            notExists.forEach(c => {
                const command = new CommandRepl(c.tag, helpfunction)
                const src = eval(`const obj = ${c.src};obj`)
                Object.keys(src).map(key => command.register(key, src[key]))
                this.repl.register(command)
            })
            return this.client.logger.ready('Scripts Repl loaded')
        })
    }
}

class CommandRepl{
    constructor(name, fn){
        this.name = name
        this.run = fn
        this.commands = []
    }
    register(name, fn){
        if(name instanceof CommandRepl){
            this.commands.push(name)
        }else{
            this.commands.push(new CommandRepl(name, fn))
        }
        // console.log('Added command:', name, ' - ', this.name)
        return this
    }
    run(ctx, client, response){

    }
    render(){
        console.log(render(this, '', 0))
    }
    has(command_name){
        return this.commands.find(c => c.name === command_name)
    }
}

function render(cmd, sum = '', lvl){
    return cmd.commands.reduce((c, s) => {

    }, '')
    if(cmd.commands.length){
        return sum + ' '.repeat(lvl) + '\n' + render(cmd.commands, sum, lvl+1) + '\n'
    }else{
        return sum +  cmd.name + '\n'
    }
}
function parse(commands, ctx){
    const command = commands.find(command => command.name === ctx[0])
    const [_, ...restargs] = ctx
    if(command && command.commands.length){
        const parsed = parse(command.commands, restargs)
        return parsed.command ? parsed : { command, ctx : restargs}
    }else{
        return { command, ctx: restargs }
    }
}

const helpfunction = (_, client, response, command) => response.table(["Command", "Description"], command.commands.map(cmd => [cmd.name, cmd.description]))