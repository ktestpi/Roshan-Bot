const { Component } = require('aghanim')
const { inspect } = require('util')

module.exports = class Repl extends Component{
    constructor(client, options){
        super(client, options)
        this.enable = false
        this.replChannel = "571165419977834506"
        this.scriptsChannel = "470189277544841226"
    }
    ready(client){
        this.update()
    }
    messageCreate(msg, client){
        if(msg.channel.id === this.this.replChannel && !msg.author.bot && msg.author.id === msg.author.id !== this.client.owner.id){ 
            const response = msg.reply.bind(msg)
            response.table = (head, array) => response(head.join(' | ')+'\n'+array.map(el => el.join(' | ')).join('\n'))
            response.object = (obj) => response(`\`\`\`js\n${String(obj)}\`\`\``)
            response.keyval = (obj) => response(Object.keys(obj).map(key => `${key}: ${obj[key]}`).join('\n'))
            response.js = (obj) => response(`\`\`\`js\n${inspect(obj)}\`\`\``)
            
            let input = msg.content.split(' ')
            const { command, ctx } = parse(this.repl.commands, input)
            if(command){
                return Promise.resolve(command.run(ctx, client, response)).catch(response)
            }
        }
    }
    update(){
        const guild = new CommandRepl('guild')
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

        const user = new CommandRepl('user')
        user.register('info',
            ([id], client, response) => {
                const user = client.users.find(user => user.id === id || user.username.toLowerCase().includes(id))
                if(user){
                    const {username} = user
                    return response.keyval({username})
                }
            }
        )
        user.register('profile',
            ([id], client, response) => {
                return response.js(client.cache.profiles.get(id))
            }
        )
        this.repl = new CommandRepl()
        this.repl.register(guild)
        this.repl.register(user)
        this.repl.register('refresh', (_, client, response) => this.update().then(() => response('Done refresh')))
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
                    console.log('Added to', command.name, c.tag)
                }catch(err){
                    console.error(err)
                }
            })
            notExists.forEach(c => {
                const command = new CommandRepl(c.tag)
                const src = eval(`const obj = ${c.src};obj`)
                Object.keys(src).map(key => command.register(key, src[key]))
                this.repl.register(command)
                console.log('New to', command.name, c.tag)
            })
            return this.client.components.Notifier.console('Scripts Repl', 'Loaded')
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
        console.log('Added command:', name, ' - ', this.name)
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
    console.log(cmd.commands.length)
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
        return parse(command.commands, restargs)
    }else{
        return { command, ctx: restargs }
    }
}