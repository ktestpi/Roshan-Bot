const DashboardMessage = require('../classes/dashboard.message.js')
const Player = require('./player')
const HistoryAction = require('./history.action')
const BoardStack = require('./stack')
const HandBoard = require('./hand')
const gameconfig = require('../duel.config.js')
const Card = require('../cards/card.js')

module.exports = class Board extends DashboardMessage{
    constructor(config){
        super(config)
        this.id = this.channel.id
        this.registerCommand(new DashboardMessage.DashboardCommand('concede', 'Concede the game',
            (msg, args, client, that) => {
                const player = this.players.find(player => player.id === msg.author.id)
                if(player){
                    this.close(player.enemy)
                }

            }))
        this.registerCommand(new DashboardMessage.DashboardCommand('help', 'Help command',
            (msg, args, client, that) => {
                return msg.reply({ embed : {
                    title : 'Duel Help',
                    description: 'Objective:',
                    fields: [
                        {name: 'Win', value: "Reduce opponent's hero hp to 0", inline: false},
                        {name: 'How to', value: 'Battle 2 players with shared cards. Use reactions as buttons to active actions', inline: false}
                    ]
                }
                }).then(m => setTimeout(m.delete, gameconfig.board.timeDeleteMessage))
            }))

        this.registerCommand(new DashboardMessage.DashboardCommand('log', 'Help command',
            (msg, args, client, that) => {
                console.log(this.players)
            }))

        this.registerCommand(new DashboardMessage.DashboardCommand('pm', 'Help command',
            (msg, args, client, that) => {
                console.log(this.players.map(player => player.modifiers))
            }))
        this.registerCommand(new DashboardMessage.DashboardCommand('hand', 'Help command',
            (msg, args, client, that) => {
                console.log('HAND',this.hand.actions, this.hand.items)
            }))
        // this.buttonss = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']
        // this.buttons = ['✅', '1⃣', '2⃣', '3⃣', '4⃣', '🅰', '🅱'] // '🇦', '🇧', '🇸'
    }
    init(player1, player2){
        return super.init().then(() => {
            return this.addActionButton({ button: gameconfig.emojis.refresh , add : () => {
                if (Date.now() - this.tsLastRefresh > gameconfig.board.timeRefreshAction){
                    this.tsLastRefresh = Date.now()
                    return this.render()
                }
            }})
        }).then(() => {
            this.tsLastRefresh = Date.now()
            this.turn = 0
            this.indexPlayer = 0
            this.round = 1
            this.stack = []
            this.history = []
            this.players = []
            this.player1 = new Player(player1)
            this.player2 = new Player(player2)
            this.registerPlayer(this.player1)
            this.registerPlayer(this.player2)
            this.currentPlayerIndex = 0
            this.initiativePlayer = this.currentPlayer
            this.hand = new HandBoard()
            const self = this
            this.addEffect({
                event: 'game_players_die?',
                run: (board) => {
                    const losers = board.players.filter(player => player.hp < 0)
                    if (losers.length === 1) {
                        const winner = losers[0].enemy
                        return winner.createNotification('**wins!!**').then(() => board.close(winner))
                    } else if (losers.length === 2) {
                        return board.createNotification(`**${board.player1.name} and ${board.player2.name} draws**`).then(() => this.close())
                    }
                }
            })
            this.addEffect({
                event: 'game_units_die?',
                run: (board) => {
                    board.players.forEach(player => {
                        player.units.filter((unit, index) => index > 0).forEach(unit => {
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
                    unit.owner.enemy.incrementGold(unit.bounty)
                    unit.owner.createNotification(`gets +${unit.bounty} <emoji_gold> for kill ${unit.name}`)
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
                        player.modifiers.filter(modifier => modifier.event && modifier.event === 'game_round_starts')
                            .forEach(modifier => {
                                if (modifier.run) {
                                    modifier.run(modifier.ctx)
                                }
                                if (typeof modifier.expiration === 'number') {
                                    modifier.expiration--
                                    if (modifier.expiration <= 0) {
                                        player.removeModifier(modifier)
                                    }
                                }
                            })

                    })
                    board.currentPlayerIndex = board.initiativePlayer.playerIndex
                }
            })
            this.addEffect({
                event: 'game_round_ends',
                run: (board) => {
                    board.players.forEach(player => {
                        player.modifiers.filter(modifier => modifier.event && modifier.event === 'game_round_ends')
                            .forEach(modifier => {
                                if (modifier.run) {
                                    modifier.run(modifier.ctx)
                                }
                                if (typeof modifier.expiration === 'number') {
                                    modifier.expiration--
                                    if (modifier.expiration <= 0) {
                                        player.removeModifier(modifier)
                                    }
                                }
                            })

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
                    player.createNotification(`played ${card.name} - ${card.description}`)
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
                        this.addHistoryAction({type: 'game_round_starts' , description: `Round ${this.round} starts`})
                        // Check if player hp < 0

                    }
                    board.emit('game_turn_starts', board)
                    // return board.currentPlayer.createNotification('ends turn').then(() => {
                    //     board.currentPlayerIndex = board.currentPlayerIndex === 0 ? 1 : 0
                    //     // Pass the round
                    //     if (board.turn > 0 && board.turn % 2 === 0) {
                    //         // this.emit('before_combat')
                    //         // Attack each player

                    //         board.players.forEach(player => player.attack(player.enemy))
                    //         board.emit('game_players_die?', board)
                    //         board.emit('game_round_starts', board)
                    //         // Check if player hp < 0

                    //     }
                    //     board.emit('game_turn_start', board)
                    // })
                }
            })
            this.addHistoryAction({ type: 'start_game', description: 'Start game', source: this })
        })
    }
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
        const content = this.replaceContent({
            embed: {
                title: this.player1.name + ' vs ' + this.player2.name,
                description: winner ? `**${winner.name} won!!**` : `**${this.player1.name} and ${this.player2.name} draws**`,
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
        return this.message.edit(content).then( () => this.unregister() )// close the lobby/channel?
    }
    messageReactionAdd(msg, emoji, userID, client) {
        if (this.message && msg.id === this.message.id){
            if (this.player1 && this.player2 && this.currentPlayer.id === userID){
                const playerActions = [{ button: gameconfig.board.buttons[0], action: this.currentPlayer.passTurn }, ...this.hand.playerActions, { button: gameconfig.board.buttons[7], action: this.currentPlayer.skill}]
                let playerAction = playerActions.find(action => action && action.button === emoji.name)
                playerAction = playerAction && playerAction.action ? playerAction.action : null
                if (playerAction && playerAction.can(this.currentPlayer, this.opponentPlayer, this)){
                    playerAction.run(this.currentPlayer, this.opponentPlayer, this)
                    this.emit('game_turn_next', this, playerAction)
                }
            }
            if (this.player1 && this.player2 && this.players.find(player => player.id === userID)){
                if(emoji.name === gameconfig.emojis.refresh){
                    this.actions.add[gameconfig.emojis.refresh]()
                }
            }
            if(userID !== client.user.id){
                msg.removeReaction(emoji.name, userID)
            }
        }
    }
    addHistoryAction(action){
        this.history.push(new HistoryAction(action))
        return this.render()
    }
    pushStack(action){
        this.stack.push(action)
    }
    render() {
        const content = this.replaceContent({
            embed: {
                title: 'Duel: ' + this.player1.name + ' vs ' + this.player2.name + ' - ' + this.id,
                description: '',
                fields: [
                    this.player1.render(),
                    this.player2.render(),
                    this.hand.render(),
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
}