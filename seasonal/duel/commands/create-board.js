const { Command, Component } = require('aghanim')
const DashboardMessage = require('../classes/dashboard.message.js')
const Board = require('../core/board.js')
const gameconfig = require('../duel.config.js')

module.exports = new Command('duel', { category: 'Fun', hide: true,
    check: (msg, args, client, command) => msg.channel.id === client.components.DuelGame.channelMatchmakingID},
    async function (msg, args, client, command) {
        // const newBoard = new Board(msg.channel)
        msg.delete()
        const awaitMessage = new DashboardMessage({
            channel: msg.channel,
            initialMessage: {
                content: {
                    embed: {
                        description: `${msg.author.username} wants to play a Duel. React with ${gameconfig.emojis.accept} to join the game.`
                    }
                }
            },
            buttons: [{
                button: gameconfig.emojis.accept,
                add: (msg, emoji, userID, client, that) => { 
                    if (userID !== that.author.id && client.server.members.has(that.author.id) && client.server.members.has(userID)) {
                        const player1 = { id: that.author.id, name: that.author.username, avatar: that.author.avatarURL, rank: 0, color: 1000000, mention: `<@${that.author.id}>`}
                        const user2 = client.users.get(userID)
                        const player2 = { id: user2.id, name: user2.username, avatar: user2.avatarURL, rank: 0, color: 950 , mention: `<@${user2.id}>`}
                        return that.update({ embed: {
                                title: `${player1.name} vs ${player2.name}`,
                                description: `${player2.name} joined to game!` }
                            }).then(() => that.unregister())
                                .then(() => client.createChannel(client.server.id, `Lobby ${player1.name} vs ${player2.name}`,0, "Duel game", {parentID: client.components.DuelGame.categoryID}))
                                .then((channel) => {
                                    // Create channel lobby and give permissions to players
                                    return Promise.all([channel.editPermission(player1.id, 1024, null, "member"), channel.editPermission(player2.id, 1024, null, "member")]).then(() => {
                                        const board = new Board({
                                            channel: channel,
                                            initialMessage: {
                                                content : {
                                                    embed : {
                                                        description: 'Creating board...' 
                                                    }
                                                }
                                            },
                                            buttons: gameconfig.board.buttons.map(button => ({button: button}))
                                        })
                                        board.locale = (string, extra) => client.components.DuelGame.findAndReplace(string, extra)
                                        board.replaceContent = (content, extra) => client.components.DuelGame.replaceContent(content, extra)
                                        board.createMessage = function(content, extra, file) { return client.components.DuelGame.createMessage(this.channel, content, extra, file)}
                                        board.destroyLobby = () => channel.delete()
                                        board.log = (event) => client.emit(event, board)
                                        client.components.DuelGame.awaitManager.register(board)
                                        return board.init(player1, player2)
                                    })
                            })
                        }
                    }
                },
                { 
                    button: gameconfig.emojis.x,
                    add: (msg, emoji, userID, client, that) => {
                        if(userID === that.author.id){
                            that.unregister()
                            return that.update({embed: {
                                description: `${that.author.username} canceled duel game.`
                            }})
                        }
                    }    
                }]
        })
        awaitMessage.author = msg.author
        client.components.DuelGame.awaitManager.register(awaitMessage)
        return awaitMessage.init()
        // client.components.DuelGame.awaitManager.createAwaitMessage()
        // newBoard.destroy = function () {
        //     client.components.DuelGame.destroyBoard(this)
        // }
        // return newBoard.open(msg.author)
        // return board.create({ id: '189996884322942976', name: 'Desvelao^^', avatar: '', rank: '', color: 0 },
        //     { id: '314083101129310208', name: 'Ktestpi', avatar: '', rank: '', color: 0 })
    }
)