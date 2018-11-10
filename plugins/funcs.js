const { Plugin } = require('aghanim')
const util = require('erisjs-utils')
const { Message, Guild } = require('erisjs-utils')
const { resetServerConfig } = require('../helpers/basic.js')

module.exports = class Funcs extends Plugin {
    constructor(client, options) {
        super(client)
        this.client.setStatus = this.setStatus.bind(this.client)
        this.client.messageAllGuilds = this.messageAllGuilds.bind(this.client)
        this.client.loadLastPatchNotes = this.loadLastPatchNotes.bind(this.client)
        this.client.updateLeaderboard = this.updateLeaderboard.bind(this.client)
    }
    ready() {
        this.client.loadLastPatchNotes()
        
    }
    setStatus(type, status, msg, url, update){
        this.config.status = status !== null ? status : this.config.status
        this.config.status_act = type !== null ? type : this.config.status_act
        this.config.status_msg = msg !== null ? msg : this.config.status_msg
        this.config.status_url = url !== null ? url : this.config.status_url
        let promises = []
        if (update) {
            promises.push(this.db.child('bot').update({ status: this.config.status, status_act: this.config.status_act, status_msg: this.config.status_msg, status_url: this.config.status_url }))
        }
        promises.push(this.editStatus(this.config.status, { name: this.config.status_msg, type: this.config.status_act, url: this.config.status_url }))
        return Promise.all(promises)
    }
    messageAllGuilds(msg, all, mode) {
        if (!this.config.switches.msgGuilds) { return }
        const message = mode !== 'feeds' ? msg.content : `${this.config.emojis.default.feeds} **${msg.author.username}**: ${msg.content}`;
        const author = enumFeeds.getKey(msg.author.username);
        const servers = this.guilds.map(g => g)//this.cache.servers.getall()
        if (!servers) { return };
        if (msg.attachments.length < 1) {
            servers.forEach(server => {
                const cached = this.cache.servers.get(server.id)
                if (!cached) { return resetServerConfig(this, server).then(() => this.notifier.guildnew(`**${server.name}**`)).catch(err => this.errorManager.emit(new ConsoleError('guildsaving', `Error creating config for **${server.name}** (${server.id})`))) }
                if (!all && cached && !cached[mode].enable) { return };
                const channel = cached ? cached[mode].channel : Guild.getDefaultChannel(server, this, true).id
                if (mode === 'feeds' && !cached.feeds.subs.split(',').includes(author)) { return }
                this.createMessage(channel, { content: message, embed: msg.embeds.length > 0 ? msg.embeds[0] : {}, disableEveryone: false }).catch(err => {
                    // Create the message to defaultChannel of guild (not cofigurated)
                    // this.createMessage(Guild.getDefaultChannel(server,this,true).id,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false})
                    this.errorManager.emit(new ConsoleError('guildmessage', `Error al enviar un mensaje a la guild\n**${server.name}** (${server.id}) [#${channel}]`))
                })
            })
        } else {
            Message.sendImage(msg.attachments[0].url).then(buffer => {
                servers.forEach(server => {
                    const cached = this.cache.servers.get(server.id)
                    if (!cached) { return resetServerConfig(this, server).then(() => this.notifier.guildnew(`**${server.name}**`)).catch(err => this.errorManager.emit(new ConsoleError('guildsaving', `Error creating config for **${server.name}** (${server.id})`))) }
                    if (!all && cached && !cached[mode].enable) { return };
                    const channel = cached ? cached[mode].channel : Guild.getDefaultChannel(server, this, true).id
                    if (mode === 'feeds' && !cached.feeds.subs.split(',').includes(author)) { return }
                    this.createMessage(channel, { content: message, embed: msg.embeds.length > 0 ? msg.embeds[0] : {}, disableEveryone: false }, { file: results, name: msg.attachments[0].filename }).catch(err => {
                        // Create the message to defaultChannel of guild (not cofigurated)
                        // this.createMessage(Guild.getDefaultChannel(server,this,true).id,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false},{file : results, name : msg.attachments[0].filename})
                        this.errorManager.emit(new ConsoleError(`Error al enviar un mensaje a la guild\n**${server.name}** (${server.id}) [#${channel}]`))
                    })
                })
            })
        }
        // if(!notAll){config.logger.add(mode,message,true)}else{config.logger.add('shout',message,true);}
    }
    loadLastPatchNotes(){
        this.getMessage(this.config.guild.changelog, this.server.channels.get(this.config.guild.changelog).lastMessageID).then(m => {
            this._lastUpdateText = m.content
        })
        this.notifier.console('patch notes')
    }
    updateLeaderboard(snap) {
        if(snap){
            return Object.keys(snap).map(p => ({ discord_id: p, dota_id: snap[p].profile.dota }))
                .filter(player => player.dota_id)
                .map(player => {
                    const guild = this.guilds.find(g => g.members.get(player.discord_id))
                    let member
                    if (guild) {
                        member = guild.members.get(player.discord_id)
                    }
                    player.username = member ? member.username : false
                    player.avatar = member ? member.avatarURL : false
                    return player
                })
                .reduce((promise, player) => {
                    return promise.then(results => new Promise(res => {
                        setTimeout(() => this.plugins.Opendota.player_steam(player.dota_id).then(dataArray => {
                            const [data] = dataArray;
                            player.data = data; res([...results, player])
                        }), 2000)
                    }))
                }, Promise.resolve([]))
                .then(players => {
                    const update = players.reduce((update, player) => {
                        const { data } = player
                        if (!data) { return update }
                        const rank = odutil.getMedal(data, 'raw')
                        update.ranking[player.discord_id] = {
                            username: player.username || data.profile.personaname,
                            nick: data.profile.personaname || '',
                            avatar: player.avatar || data.profile.avatarmedium,
                            rank: rank.rank,
                            leaderboard: rank.leaderboard
                        }
                        return update
                    }, { updated: util.Date.now(), ranking: {} })
                    return this.db.child('leaderboard').set(update).then(() => this.notifier.console('Ranking Updated'))
                })    
        }else{
            // this.db.child('profiles').once('value').then((snap) => {
            //     if(!snap.exists){this.notifier.console('Not exists')}
            //     this.updateLeaderboard(snap.val())
            // })
            // this.cache.profiles.getall(p => ({}))
        }
        
    }
    updatePlayerLeaderboard(discordID,dotaID){
        // this.plugins.Opendota.account(dotaID)
    }
}