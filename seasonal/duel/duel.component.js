const { Command, Component } = require('aghanim')
const path = require('path')
const Board = require('./core/board.js')
const Player = require('./core/player.js')
const HandBoard = require('./core/hand.js')
const { AwaitMessageManager } = require('./classes/await-message.js')
const gameconfig = require('./duel.config.js')
// Board.config = gameconfig
// Player.config = gameconfig
// HandBoard.config = gameconfig

module.exports = class DuelGame extends Component{
    constructor(client, options){
        super(client)
        this.categoryID = "623994429979492373"
        this.channelLogID = "624002949609291816"
        this.channelMatchmakingID = "624002949609291816"
        this.awaitManager = new AwaitMessageManager(this.client)
        // this.client.addCategory('Duel', 'DuelGame')
        this.client.components.Locale.lang['en']['cmd_duel_args'] = ''
        this.client.components.Locale.lang['en']['cmd_duel_help'] = 'Create a duel'
        this.client.components.Locale.lang['es']['cmd_duel_args'] = ''
        this.client.components.Locale.lang['es']['cmd_duel_help'] = 'Crea un duelo'
        this.client.addCommandDir(path.join(__dirname, './commands') )
        this.locale = {}
        this.client.on('duel:awaitmanager:messageCreate', (err, msg, client, message) => {
            console.log('Error: messageCreate', message.id, err)
        })
        this.client.on('duel:awaitmanager:messageReactionAdd', (err, msg, emoji, userID, client, message) => {
            console.log('Error: messageReactionAdd', message.id, err)
        })
        this.client.on('duel:awaitmanager:messageReactionRemove', (err, msg, emoji, userID, client, message) => {
            console.log('Error: messageReactionRemove', message.id, err)
        })
        this.client.on('duel:initgame', (board) => {
            this.client.createMessage(this.channelLogID, `Init game: ${board.players.map(player => player.mention).join(' vs ')}`)
        })
        this.client.on('duel:closegame', (board) => {
            this.client.createMessage(this.channelLogID, {embed: board.resultMessage})
        })
    }
    ready(){
        Object.keys(gameconfig.emojis).forEach(emojiKey => this.addLocale('emoji_' + emojiKey, gameconfig.emojis[emojiKey]))
        this.addLocale('emoji_gold', this.client.config.emojis.bot.gold)
        this.addLocale('emoji_mana', this.client.config.emojis.bot.mana)
        // return;
        // this.testBoard()
    }
    testBoard(){
        const user1 = this.client.users.get('189996884322942976')
        const player1 = { id: user1.id, name: user1.username, avatar: user1.avatarURL, rank: 0, color: 1000000 }
        const user2 = this.client.users.get('314083101129310208')
        const player2 = { id: user2.id, name: user2.username, avatar: user2.avatarURL, rank: 0, color: 950 }
        const self = this
        const board = new Board({
            channel: self.client.server.channels.get('327603261085581312'),
            initialMessage: {
                content: {
                    embed: {
                        description: 'Creating board...'
                    }
                }
            },
            buttons: gameconfig.board.buttons.map(button => ({ button: button }))
        })
        board.locale = (string, extra) => self.client.components.DuelGame.findAndReplace(string, extra)
        board.replaceContent = (content, extra) => self.client.components.DuelGame.replaceContent(content, extra)
        board.createMessage = function (content, extra, file) { return self.client.components.DuelGame.createMessage(this.channel, content, extra, file) }
        self.client.components.DuelGame.awaitManager.register(board)
        return board.init(player1, player2)
    }
    addLocale(key, value = '') {
        this.locale[key] = value
    }
    findAndReplace(string, extra = {}) {
        let find
        const found = []
        const re = new RegExp('<([^>]+)>', 'g')
        while (find = re.exec(string)) {
            found.push(find[1])
        }
        found.forEach(f => {
            if (this.locale[f]) {
                string = string.replace('<' + f + '>', this.locale[f])
            } else if (extra[f]) {
                string = string.replace('<' + f + '>', extra[f])
            }
        })
        return string
    }
    // board.locale = (str, extra) => client.components.DuelGame.findAndReplace(str, extra)
    replaceContent(content, extra) {
        if (typeof content === 'string') {
            return this.findAndReplace(content, extra)
        } else {
            Object.keys(content).forEach(key => {
                if (typeof content[key] === 'string') {
                    content[key] = this.findAndReplace(content[key], extra)
                } else if (typeof content[key] === 'object') {
                    content[key] = this.replaceContent(content[key], extra)
                }
            })
        }
        return content
    }
    createMessage(channel, content, extra, file) {
        const ctx = this.replaceContent(content, extra)
        return channel.createMessage(ctx, file)
    }
    messageCreate(msg, client){
        this.awaitManager.messageCreate(msg, client)
    }
    messageReactionAdd(msg, emoji, userID, client) {
        this.awaitManager.messageReactionAdd(msg, emoji, userID, client)
    }
    messageReactionRemove(msg, emoji, userID, client) {
        this.awaitManager.messageReactionRemove(msg, emoji, userID, client)
    }
}
