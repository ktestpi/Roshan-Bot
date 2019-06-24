module.exports.AwaitMessage = class AwaitMessage {
    /**
     * 
     * @param {} config
     * @param {*} manager 
     */
    constructor(config = {}) {
        this.timeout = config.timeout || -1
        this.timer = null
        this.channel = config.channel
        this.initialMessage = config.initialMessage
        if(this.timeout > 0){
            this.timer = setTimeout(() => this.destroy(), this.timeout)
        }
        if(config.message){
            this.message = config.message
        }
        // this.manager.add(this)
    }
    init(){
        return this.message ? Promise.resolve() : this.channel.createMessage(this.initialMessage.content, this.initialMessage.file).then((m) => {
            this.message = m
        })
    }
    destroyTimer(){
        if(this.timer){ clearTimeout(this.timer) }
    }
    messageCreate(msg, client) {
        if (this.message && isEqual(msg.channel.id, this.message.id)){
            this.onMessageCreate(msg, client)
        }
    }
    messageReactionAdd(msg, emoji, userID, client) {
        if (this.message && isEqual(msg.id, this.message.id)) {
            this.onMessageReactionAdd(msg, emoji, userID, client)
        }
    }
    messageReactionRemove(msg, emoji, userID, client) {
        if (this.message && isEqual(msg.id, this.message.id)) {
            this.onMessageReactionRemove(msg, emoji, userID, client)
        }
    }
    onMessageCreate(msg, args, client){}
    onMessageReactionAdd(msg, emoji, userID, client){}
    onMessageReactionRemove(msg, emoji, userID, client){}
    onInit(that){}
}

const isEqual = (param1, param2) => param1 === param2

module.exports.AwaitMessageManager = class AwaitMessageManager{
    constructor(client){
        this.client = client
        this.awaitMessages = []
    }
    createAwaitMessage(awaitMessageConfig = {}){
        const awaitMessage = new AwaitMessage(awaitMessageConfig)
        return awaitMessage
    }
    register(awaitMessage){
        awaitMessage.unregister = () => this.unregister(awaitMessage)
        this.awaitMessages.push(awaitMessage)
    }
    unregister(awaitMessage){
        this.awaitMessages = this.awaitMessages.filter(message => message !== awaitMessage)
    }
    messageCreate(msg, client){
        this.awaitMessages.forEach(async message => {
            try{
                await message.messageCreate(msg, client)
            }catch(err){
                this.client.emit('duel:awaitmanager:messageCreate', err, msg, client, message)
            }
        })
    }
    messageReactionAdd(msg, emoji, userID, client) {
        this.awaitMessages.forEach(async message => {
            try {
                await message.messageReactionAdd(msg, emoji, userID, client)
            } catch (err) {
                this.client.emit('duel:awaitmanager:messageReactionAdd', err, msg, emoji, userID, client, message)
            }
        })
    }
    messageReactionRemove(msg, emoji, userID, client) {
        this.awaitMessages.forEach(async message => {
            try {
                await message.messageReactionRemove(msg, emoji, userID, client)
            } catch (err) {
                this.client.emit('duel:awaitmanager:messageReactionRemove', err, msg, emoji, userID, client, message)
            }
        })
    }
}