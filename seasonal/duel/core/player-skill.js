module.exports = class PlayerSkill{
    constructor(options = {}, player){
        Object.keys(options).forEach(key => {
            this[key] = options[key]
        })
        this.name = options.name || ''
        this.description = options.description || ''
        this.player = player
        this.cooldown = options.cooldown || 0
        this.refresh = options.refresh || 0
    }
    canPlay(sourcePlayer, targetPlayer, board){
        if(this.passive){return false}
        if (this.cooldown > 0) {
            this.player.createNotification(`${this.name} is on cd (${this.cooldown})`)
            return false
        }
        return this.requirements(sourcePlayer, targetPlayer, board)
    }
    play(sourcePlayer, targetPlayer, board) {
        this.run(sourcePlayer, targetPlayer, board)
        this.cooldown = this.refresh
    }
    requirements(sourcePlayer, targetPlayer, board) {
        return true
    }
    run(sourcePlayer, targetPlayer, board){
        
    }
    reduceCooldown(){
        this.cooldown--
    }
    onAcquire(){

    }
    onDestroy(){

    }
    render(){
        return `<emoji_skill> **${this.name}**: ${this.description}`
    }
}