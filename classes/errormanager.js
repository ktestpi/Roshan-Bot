module.exports.ErrorManager = class ErrorManager{
    constructor(client,options){
        this.client = client
        this.channel = options.channel
        this.errors = {}
        // Object.keys(options.errors).forEach(tagerror => {
        //     this.errors[tagerror] = {}
        // })
        this.eventEmit = 'error'
        this.icons = {
            opendota: '🎮❌'
        }
        this.config = {userSilent : true}

        this.client.on('aghanim:command:error', (error, msg, args, command) => {
            console.log(error)
            if (error instanceof UserError) {
                this.send(msg.channel.id, error.reply(msg))
                if(this.config.userSilent && !error.err){return}
                this.console(error.toConsole(msg, args, command))
            } else if (error instanceof ConsoleError){
                this.console(error.toConsole(msg, args, command))
            }else{
                this.errorToConsole(error)
            }
        })

        this.client.on('aghanim:error:', (error) => {
            console.log(error)
            this.errorToConsole(error)    
        })

        this.client.on('error', (error) => {
            console.log(error)
            this.console(`${toCode(error.stack)}`)
        })
    }
    getIcon({type}){
        return this.icons[type] || ':x:'
    }
    compose(error){
        return `${this.getIcon(error)} ${error.message}`
    }
    composeDev(error) {
        return `${this.getIcon(error)} ${error.messageDev}\n${toCode(error.stack)}`
    }
    emit(error){
        this.client.emit(this.eventEmit,error)
    }
    send(channel,message){
        return this.client.createMessage(channel,message)
    }
    console(message){
        return this.send(this.channel,message)
    }
    reply(msg,message){
        return this.send(msg.channel.id,message)
    }
    errorToConsole(error){
        this.console(new ConsoleError('ND', error.message, error).toConsole()) 
    }
    // embedConsoleUser(error, msg, args, command){
    //     const embed = {
    //         author: { name: `${msg.author.name} - ${msg.author.id}`, icon_url: msg.author.iconURL },
    //         description: msg._client.locale.replacer(ctx.msg._client.locale.getDevString(string), ctx.replacer),
    //         footer: { text: `Error: ${this.type || 'ND'} - ${this.cmd || ''}` }
    //     }
    //     if (this.err) {
    //         embed.fields = [{ name: 'Stack', value: toCode(this.err.stack), inline: false }]
    //     }
    // }
}

class BaseError extends Error{
    constructor(type, messageCode, replacer, err){
        super(messageCode)
        this.type = type
        if (replacer instanceof Error){
            this.replacer = null
            this.err = replacer
        }else{
            this.replacer = replacer
            this.err = err
        }
    }
}

class UserError extends BaseError {
    constructor(type, messageCode, replacer, err) {
        super(type, messageCode, replacer, err)
    }
    toConsole(msg, args, command){
        const embed = {
            author: { name: `${msg.author.username} - ${msg.author.id}`, icon_url: msg.author.iconURL },
            description: msg._client.locale.replacer(msg._client.locale.getDevString(this.message), this.replacer),
            footer: { text: `Error: ${this.type || 'ND'} - ${command.name || ''}` }
        }
        if (this.err) {
            embed.fields = [{ name: 'Stack', value: toCode(this.err.stack), inline: false }]
        }
        return { embed }
    }
    reply(msg){
        return msg._client.locale.replacer(msg._client.locale.getUserString(this.message, msg), this.replacer)
    }
}

class ConsoleError extends BaseError {
    constructor(type, messageCode, err) {
        super(type, messageCode, null, err)
        if(err.err){this.errc = err.err}
    }
    toConsole(msg, args, command) {
        const embed = {
            description: this.message,
            fields : [{ name: 'Stack', value: toCode(this.err ? this.err.stack : this.stack), inline: false }],
            footer: { text: `Error: ${this.type || 'ND'}` }
        }
        if (this.errc) {
            embed.fields.push({ name: 'Stack Err', value: toCode(this.errc.stack), inline: false })
        }
        return { embed }
    }
}

class UserSilentError extends BaseError {
    constructor(type, messageCode, replacer, err) {
        super(type, messageCode, replacer, err)
    }
    toConsole(msg, args, command) {
        const embed = {
            author: { name: `${msg.author.username} - ${msg.author.id}`, icon_url: msg.author.iconURL },
            description: msg._client.locale.replacer(msg._client.locale.getDevString(this.message), this.replacer),
            footer: { text: `Error: ${this.type || 'ND'} - ${command.name || ''}` }
        }
        if (this.err) {
            embed.fields = [{ name: 'Stack', value: toCode(this.err.stack), inline: false }]
        }
        return { embed }
    }
}

module.exports.UserError = UserError
module.exports.ConsoleError = ConsoleError
module.exports.UserSilentError = UserSilentError

function toCode(string){
    return `\`\`\`${string}\`\`\``
}