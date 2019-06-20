module.exports = class HistoryAction {
    constructor(historyAction) {
        this.type = historyAction.type
        this.description = historyAction.description
        this.source = historyAction.source
    }
    render(){
        return `${this.description}`
    }
}