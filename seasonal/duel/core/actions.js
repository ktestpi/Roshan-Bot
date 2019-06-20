module.exports = class Action{
    constructor(type, source, target, board, expiration){
        this.type = type
        this.source = source
        this.target = target
        this.board = board
        this.expiration = expiration
    }
    run(method){
        this[method](this.source, this.target, this.board)
    }
    startRound(source, target, board){}
    endRound(source, target, board){}
    createUnit(source, target, board) { }
}