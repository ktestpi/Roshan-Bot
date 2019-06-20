module.exports = class AwaitMessage{
    constructor(config = {}){
        this.timeout = config.timeout || -1
    }
    messageCreate(msg, args, client){

    }
}