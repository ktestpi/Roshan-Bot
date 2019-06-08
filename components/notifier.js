const { Logger } = require('aghanim')
const { Component } = require('aghanim')

module.exports = class Notifier extends Component{
    constructor(client,options){
        super(client)
        this.channel = this.client.config.notifier.channel
        this.ignore = this.client.config.notifier.ignore || []
        this.logger = new Logger({
            label: 'Roshan',
            timestamps: true,
            levels: { dev: { style: 'magenta' } },
            // ignoredLevels: [this.devLogs ? '' : 'dev']
        })
        Object.keys(this.client.config.notifier.events).forEach(event => {
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
        if(tag === 'INFO'){
            this.logger.log(`${ tag ? '[' + tag + '] ' : ''} - ${message}`)
        } else if (tag === 'WARN'){
            this.logger.warn(`${ tag ? '[' + tag + '] ' : ''} - ${message}`)
        } else{
            this.logger.log(`${ tag ? '[' + tag + '] -' : '-'} ${ message }`)
        }
    }
    info(message){
        this.console('INFO',message)
    }
    warn(message) {
        this.console('WARN', message)
    }
}
