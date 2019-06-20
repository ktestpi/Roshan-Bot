module.exports = class StackEffect {
    constructor(config) {
        this.event = config.event
        this.source = config.source
        this.target = config.target
        this.board = config.board
        this.expiration = config.expiration
        if(config.run){
            this.run = config.run
        }
    }
    exe(...args){
        this.run(...args)
    }
    run() {}
}