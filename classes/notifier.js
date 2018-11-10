 module.exports = class Notifier{
    constructor(client,options){
        this.client = client
        this.channel = options.channel
        this.ignore = options.ignore || []
        Object.keys(options.events).forEach(event => {
            this[event] = (message) => {
                if(this.ignore.includes(event)){return}
                this.console(event,message)
                this.log(`${options.events[event] || ''} - ${message}`)
            }
        })
    }
    log(message){
        return this.client.createMessage(this.channel,message)
    }
    console(tag, message){
        if(!message){
            message = tag
            tag = null
        }
        const date = new Date()
        console.log(`${tag ? tag + ' ' : ''}<${date}> - ${message}`)
    }
    info(tag,message){
        this.console('INFO',message)
    }
    warn(tag, message) {
        this.console('WARN', message)
    }
}
