module.exports = class BoardStack{
    constructor(array = []){
        this.effects = array
    }
    emit(event, ...args){
        this.effects.filter(effect => effect.event === event).forEach(effect => effect.exe(...args))
        this.effects = this.effects.filter(effect => effect.expiration === 'persist' || (typeof effect.expiration === 'number' && effect.expiration >= 0))
    }
    add(effect){
        this.effects.push(effect)
    }
}