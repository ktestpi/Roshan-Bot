const DashboardMessage = require('../classes/dashboard.message.js')
const DuelPlayer = require('./player.js')
const HistoryAction = require('./history.action.js')
const HandBoard = require('./hand.js')
const gameconfig = require('../duel.config.js')
const Card = require('./card.js')
const { delay, jsFilesOnDirectory } = require('../duel.util.js')
const path = require('path')
const { deleteMessageAfterTime } = require('../duel.util.js')

const commands = jsFilesOnDirectory(path.join(__dirname,'../board-commands'))
/** @class */
module.exports = class Board extends DashboardMessage{
    /**
     * 
     * @param {*} config 
     * @prop {number} id
     */
    constructor(config){
        super(config)
        this.id = this.channel.id
        this.ready = false
        this.renderRequests = []
        commands.forEach(command => this.registerCommand(require(command)))

        // this.buttonss = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
        // this.buttons = ['✅', '1⃣', '2⃣', '3⃣', '4⃣', '🅰', '🅱'] // '🇦', '🇧', '🇸'
    }
    /**
     * 
     * @param {*} player1 
     * @param {*} player2 
     */
    init(player1, player2){
        return this.channel.createMessage(`Welcome to a Duel Game ${player1.mention} and ${player2.mention}. To see commands avaliable write on this channel \`help\``).then(() => 
            super.init().then(() => {
                return this.addActionButton({ button: gameconfig.emojis.refresh , add : () => {
                    if (Date.now() - this.tsLastRefresh > gameconfig.board.timeRefreshAction){
                        this.tsLastRefresh = Date.now()
                        return this.render()
                    }
                }})
            }).then(() => {
                this.tsLastRefresh = Date.now()
                this.startAt = Date.now()
                this.turn = 0
                this.indexPlayer = 0
                this.round = 1
                this.stack = []
                this.history = []
                this.players = []
                this.player1 = new DuelPlayer(player1)
                this.player2 = new DuelPlayer(player2)
                this.registerPlayer(this.player1)
                this.registerPlayer(this.player2)
                this.currentPlayerIndex = 0
                this.initiativePlayer = this.currentPlayer
                this.hand = new HandBoard()
                const self = this 
                this.addEffect({
                    event: 'game_players_die?',
                    run: (board) => {
                        const losers = board.players.filter(player => player.hp <= 0)
                        if (losers.length === 1) {
                            const winner = losers[0].enemy
                            winner.createNotification('**wins!!**')//.then(() => board.close(winner))
                            board.close(winner)
                        } else if (losers.length === 2) {
                            board.createNotification(`**${board.player1.name} and ${board.player2.name} draws**`)//.then(() => this.close())
                            board.close()
                        }
                    }
                })
                this.addEffect({
                    event: 'game_units_die?',
                    run: (board) => {
                        board.players.forEach(player => {
                            player.units.forEach(unit => {
                                if(unit.hp <= 0){
                                    player.removeUnit(unit)
                                    player.board.emit('player_unit_dies', unit)
                                }
                            })
                        })
                    }
                })
                this.addEffect({
                    event: 'player_unit_dies',
                    run: (unit) => {
                        unit.owner.enemy.addGold(unit.bounty)
                        unit.owner.enemy.createNotification(`gets **+${unit.bounty}** <emoji_gold> for kill ${unit.name}`)
                    }
                })
                this.addEffect({
                    event: 'game_round_starts',
                    run: (board) => {
                        board.turn = 0
                        board.round++
                        board.players.forEach(player => {
                            player.passiveGold()
                            player._mana = 0
                            player.emit('game_round_starts')
                        })
                        board.currentPlayerIndex = board.initiativePlayer.playerIndex
                    }
                })
                this.addEffect({
                    event: 'game_round_ends',
                    run: (board) => {
                        board.players.forEach(player => {
                            player.emit('game_round_ends')
                        })
                    }
                })
                this.addEffect({
                    event: 'game_turn_starts',
                    run: (board) => {
                        board.hand.draw()
                    }
                })
                this.addEffect({
                    event: 'game_turn_ends',
                    run: (board) => {
                    }
                })
                this.addEffect({
                    event: 'player_card_plays',
                    run: (card, player) => {
                        player.createNotification(`played **${card.name}** - ${card.description}`)
                        // return player.board.render()
                    }
                })
                this.addEffect({
                    event: 'game_turn_next',
                    run: (board, playerAction) => {
                        board.emit('game_turn_ends', board)
                        board.emit('game_players_die?', board)
                        board.emit('game_units_die?', board)

                        if(playerAction instanceof Card){
                            board.emit('player_card_plays', playerAction, this.currentPlayer)
                        }
                        board.emit('game_players_die?', board)
                        board.emit('game_units_die?', board)
                        // this.emit('game_pass_turn', this.currentPlayer)
                        // get Initiative if pass turn or card with effect getInitiative
                        if (playerAction.getInitiative) { board.initiativePlayer = board.currentPlayer }
                        // Increment the turn
                        board.turn++
                        // Remove card if is on hand
                        board.hand.remove(playerAction)

                        // Pass the turn
                        board.currentPlayerIndex = board.currentPlayerIndex === 0 ? 1 : 0
                        // Pass the round
                        if (board.turn > 0 && board.turn % 2 === 0) {
                            // this.emit('before_combat')
                            // Attack each player
                            board.players.forEach(player => player.attack(player.enemy))
                            board.emit('game_players_die?', board)
                            board.emit('game_units_die?', board)
                            board.emit('game_round_ends', board)
                            // this.addHistoryAction({ type: 'game_round_ends', description: `Round ${this.round} ends` })
                            board.emit('game_players_die?', board)
                            board.emit('game_units_die?', board)
                            board.emit('game_round_starts', board)
                            board.emit('game_players_die?', board)
                            board.emit('game_units_die?', board)
                            this.addHistoryAction({type: 'game_round_starts' , description: `-- Round ${this.round} starts --`})
                            // Check if player hp < 0

                        }
                        board.emit('game_turn_starts', board)
                    }
                })
                this.ready = true
                this.addHistoryAction({ type: 'start_game', description: 'Start game', source: this })
                this.players.forEach(player => player.start())
                this.log('duel:initgame')
            })
        )
    }
    /**
     * 
     * @param {DuelPlayer} player
     */
    registerPlayer(player){
        player.board = this
        player.playerIndex = this.indexPlayer
        this.players.push(player)
        this.indexPlayer++
    }
    emit(event, ...args){
        console.log('Emiting...', event)
        this.stack.filter(effect => effect.event === event).forEach(effect => {effect.run(...args)})
        console.log('Finish Emiting...', event)
    }
    removeEffect(effect){
        this.stack = this.stack.filter(e => e !== effect)
    }
    addEffect(effect){
        effect.destroy = () => this.removeEffect(effect)
        effect.run = effect.run ? effect.run : (board) => {}
        this.stack.push(effect)
    }
    get currentPlayer() {
        return this.players[this.currentPlayerIndex]
    }
    get opponentPlayer() {
        return this.players[this.opponentPlayerIndex]
    }
    get opponentPlayerIndex() {
        return this.currentPlayerIndex === 0 ? 1 : 0
    }
    createNotification(content, extra, file) {
        return this.createMessage(content, extra, file)
        //.then(m => setTimeout(() => m.delete(), gameconfig.board.timeDeleteMessage))
    }
    close(winner){
        this.closed = true
        this.unregister()
        const content = this.replaceContent({
            embed: {
                title: this.player1.name + ' vs ' + this.player2.name,
                description: winner ? `**${winner.name} won!!**${this.conceded ? ` ${winner.enemy.name} conceded` : ""}` : `**${this.player1.name} and ${this.player2.name} draws**`,
                fields: [
                    this.player1.render(),
                    this.player2.render(),
                    { name: 'History', value: this.history.slice(-5).map(h => h.render()).reverse().join('\n'), inline: false }
                ],
                footer: {
                    text: 'Duel'
                    // text: `Round: ${this.round} - Turn: ${this.currentPlayer.name} - ${gameconfig.emojis.initiative}: ${this.initiativePlayer.name}`
                }
            }
        })
        this.resultMessage = {
            title: this.player1.name + ' vs ' + this.player2.name,
            description: winner ? `**${winner.name} won!!**${this.conceded ? ` ${winner.enemy.name} conceded` : ""}` : `**${this.player1.name} and ${this.player2.name} draws**`
        }
        this.log('duel:closegame')
        return this.message.edit(content).then(() => delay(15000)).then(() => this.destroyLobby())
    }
    messageCreateAfter(msg, client) {
        if(this.ready && msg.channel.id === this.message.channel.id && msg.author.id !== client.user.id){
            deleteMessageAfterTime(10000)(msg)
        }
    }
    messageReactionAdd(msg, emoji, userID, client) {
        if (this.message && msg.id === this.message.id){
            if (this.ready && this.currentPlayer.id === userID){
                const playerActions = [{ button: gameconfig.board.buttons[0], action: this.currentPlayer.passTurn }, ...this.hand.playerActions, { button: gameconfig.board.buttons[7], action: this.currentPlayer.skill}]
                let playerAction = playerActions.find(action => action && action.button === emoji.name)
                playerAction = playerAction && playerAction.action ? playerAction.action : null
                if (playerAction){
                    if(playerAction.type === 'action' && this.currentPlayer.isSilenced){
                        this.currentPlayer.createNotification(`can't play action card`)
                    }else if (playerAction && playerAction.canPlay(this.currentPlayer, this.opponentPlayer, this)){
                        playerAction.play(this.currentPlayer, this.opponentPlayer, this)
                        this.emit('game_turn_next', this, playerAction)
                    }
                }
            }
            if (this.ready && this.players.find(player => player.id === userID)){
                if(emoji.name === gameconfig.emojis.refresh){
                    this.actions.add[gameconfig.emojis.refresh]()
                }
            }
            if(userID !== client.user.id){
                msg.removeReaction(emoji.name, userID)
            }
        }
    }
    // messageReactionRemove(msg, emoji, userID, client) {
    // }
    addHistoryAction(action){
        if (this.closed){ return }
        this.history.push(new HistoryAction(action))
        return this.render()
    }
    render() {
        if (this.closed) { return }
        this.renderRequests.push("")
        return delay(500).then(() => {
            this.renderRequests.pop()
            if(!this.renderRequests.length){
                const content = this.replaceContent({
                    embed: {
                        title: 'Duel: ' + this.player1.name + ' vs ' + this.player2.name + ' - ' + this.id,
                        description: '',
                        fields: [
                            this.player1.render(),
                            this.player2.render(),
                            this.hand.render('<emoji_skill> ' + this.currentPlayer.skill.name + ': ' + this.currentPlayer.skill.description + '\n<emoji_initiative> Pass & initiative'),
                            { name: 'History', value: this.history.slice(-5).map(h => h.render()).reverse().join('\n'), inline: false }
                        ],
                        thumbnail: { url: this.currentPlayer.avatar },
                        footer: {
                            text: `Round: ${this.round} - Turn: ${this.currentPlayer.name} - <emoji_initiative>: ${this.initiativePlayer.name}`
                        },
                        color: this.currentPlayer.color
                    }
                })
                return this.update(content)
            }
        })
    }
}
