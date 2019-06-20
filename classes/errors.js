class BaseError extends Error {
    constructor(type, messageCode, replacer, err) {
        super(messageCode)
        this.type = type
        if (replacer instanceof Error) {
            this.replacer = null
            this.err = replacer
        } else {
            this.replacer = replacer
            this.err = err
        }
    }
}

class UserError extends BaseError {
    constructor(type, messageCode, replacer, err) {
        super(type, messageCode, replacer, err)
    }
    toConsole(msg, args, command) {
        const embed = {
            title: `User Error: ${command.name}`,
            author: { name: `${command.name} - ${msg.author.username} - ${msg.author.id}`, icon_url: msg.author.avatarURL },
            description: msg._client.components.Locale.replacer(this.message, this.replacer, msg._client.components.Locale.defaultLanguage),
            footer: { text: `Error: ${this.type || 'ND'} - ${command.name || ''}` }
        }
        if (this.err) {
            embed.fields = [{ name: 'Stack', value: toCode(this.err.stack), inline: false }]
        }
        return { embed }
    }
    reply(msg, args) {
        return msg.author.locale(this.message, this.replacer)
    }
}

class CommandError extends BaseError {
    constructor(type, err) {
        super(type, err.message, null, err)
    }
    toConsole(msg, args, command) {
        const embed = {
            title: `:x: Command Error: ${command.name}`,
            author: { name: `${msg.author.username} - ${msg.author.id}`, icon_url: msg.author.avatarURL },
            fields: [
                { name: 'Command Content', value: toCode(msg.content), inline: false },
                { name: 'Error Message', value: toCode(this.err.message), inline: false }],
            footer: { text: `Error: ${this.type || 'ND'} - ${command.name || ''}` }
        }
        if (this.err) {
            embed.fields.push({ name: 'Stack', value: toCode(this.err.stack), inline: false })
        }
        return { embed }
    }
}

class ComponentError extends BaseError {
    constructor(type, err) {
        super(type, err.message, null, err)
    }
    toConsole(component) {
        const embed = {
            title: `:x: Component Error: ${component.constructor.name}`,
            fields: [
                // { name: 'Command Content', value: toCode(msg.content), inline: false },
                { name: 'Error Message', value: toCode(this.err.message), inline: false }],
            footer: { text: `Error: ${this.type || 'ND'} - ${component.constructor.name || ''}` }
        }
        if (this.err) {
            embed.fields.push({ name: 'Stack', value: toCode(this.err.stack), inline: false })
        }
        return { embed }
    }
}

class ConsoleError extends BaseError {
    constructor(type, messageCode, err) {
        super(type, messageCode, null, err)
        if (err && err.err) { this.errc = err.err }
    }
    toConsole(msg, args, command) {
        const embed = {
            description: this.message,
            fields: [{ name: 'Stack', value: toCode(this.err ? this.err.stack : this.stack), inline: false }],
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
            description: msg._client.components.Locale.replacer(this.message, this.replacer, msg._client.components.Locale.defaultLanguage),
            footer: { text: `Error: ${this.type || 'ND'} - ${command.name || ''}` }
        }
        if (this.err) {
            embed.fields = [{ name: 'Stack', value: toCode(this.err.stack), inline: false }]
        }
        return { embed }
    }
}

module.exports.UserError = UserError
module.exports.UserSilentError = UserSilentError
module.exports.ConsoleError = ConsoleError
module.exports.CommandError = CommandError
module.exports.ComponentError = ComponentError

function toCode(string) {
    return `\`\`\`${string.slice(0,1000)}\`\`\``
}