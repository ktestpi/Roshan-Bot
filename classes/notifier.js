const { Logger } = require('aghanim')
const logger = new Logger({
    label: 'Roshan',
    timestamps: true,
    levels: { dev: { style: 'magenta' } },
    // ignoredLevels: [this.devLogs ? '' : 'dev']
})

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
        // const date = new Date()
        // console.log(`<${date}> ${tag ? '[' + tag + '] ' : ''}- ${message}`)
        if(tag === 'INFO'){
            logger.log(`${ tag ? '[' + tag + '] ' : ''} - ${message}`)
        } else if (tag === 'WARN'){
            logger.warn(`${ tag ? '[' + tag + '] ' : ''} - ${message}`)
        } else{
            logger.log(`${ tag ? '[' + tag + '] -' : '-'} ${ message }`)
        }
    }
    info(message){
        this.console('INFO',message)
    }
    warn(message) {
        this.console('WARN', message)
    }
}
