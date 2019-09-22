const { AwaitMessage } = require('./await-message.js')
const { deleteMessageAfterTime } = require('../duel.util.js')

module.exports = class DashboardMessage extends AwaitMessage{
    constructor(config){
        super(config)
        this.autoRemoveReactionAdd = config.autoRemoveReactionAdd || false
        this.buttons = config.buttons || []
        this.clearCommands()
        this.clearActions()
    }
    update(content, file){
        if(this.message){
            return this.message.edit(content, file)
        }
    }
    registerCommand(command){
        command.unregister = () => this.unregisterCommand(command)
        this.commands.push(command)
    }
    unregisterCommand(command) {
        this.commands = this.commands.filter(cmd => cmd !== command)
    }
    clearCommands(){
        this.commands = []
        return this
    }
    registerAction(action){
        if(action.add){
            this.actions['add'][action.button] = action.add
        }else if(action.remove){
            this.actions['remove'][action.button] = action.remove
        }
    }
    unregisterAction(button, type){
        this.actions[type][button] = undefined
    }
    clearActions(){
        this.actions = {
            add : {},
            remove: {}
        }
        return this
    }
    init(){
        return super.init().then(() =>
            this.buttons.reduce((promise, action) => promise.then(()=> this.addActionButton(action)), Promise.resolve()))
    }
    addActionButton(action){
        return this.message.addReaction(action.button).then(() => this.registerAction(action))
    }
    removeActionButton(action) {
        return this.message.removeReaction(action.button).then(() => this.unregisterAction(action))
    }
    destroyMessage(){
        this.unregister()
        return this.message.delete()
    }
    removeAction(emoji){
        this.actions[emoji] = undefined
    }
    messageCreate(msg, client){
        if (this.message && msg.channel.id === this.message.channel.id) {
            const command = this.commands.find(command => msg.content.startsWith(command.name))
            if(command){
                deleteMessageAfterTime(5000)(msg)
                return command.run(msg, client, this)
            }
        }
        this.messageCreateAfter(msg, client)
    }
    messageCreateAfter(msg, client){

    }
    messageReactionAdd(msg, emoji, userID, client){
        if (this.message && msg.id === this.message.id && !client.users.get(userID).bot){
            if (this.actions['add'][emoji.name]){
                this.actions['add'][emoji.name](msg, emoji, userID, client, this)
            }
            if (this.autoRemoveReactionAdd){
                msg.removeReaction(emoji.name, userID)
            }
        }
    }
    messageReactionRemove(msg, emoji, userID, client) {
        if (this.message && msg.id === this.message.id && !client.users.get(userID).bot) {
            if (this.actions['remove'][emoji.name]) {
                return this.actions['remove'][emoji.name](msg, emoji, userID, client, this)
            }
        }
    }
}

module.exports.DashboardCommand = class DashboardCommand{
    constructor(name, description, run){
        this.name = name
        this.description = description || ''
        if(run) {this.run = run}
    }
    run(msg, args, client, that){

    }
}