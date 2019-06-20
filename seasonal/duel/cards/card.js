module.exports = class Card{
    /**
     * @constructor
     * @param {{type: string}} config Param configuration
     */
    constructor(config){
        this.type = config.type
        this.name = config.name
        this.description = config.description
        if (config.can) { this.can = config.can }
        if (config.run) { this.run = config.run }
        Object.keys(config).forEach(key => {
            this[key] = config[key]
        })
    }
    can(sourcePlayer, targetPlayer, board) {
        // board.addActionToHistory()
    }
    run(sourcePlayer, targetPlayer, board){
        // board.addActionToHistory()
    }
    action(sourcePlayer, targetPlayer, board) {
        // board.addActionToHistory()
    }
    render(index){
        // Board buttons
        return `${this.name}: ${this.description}`
    }
}