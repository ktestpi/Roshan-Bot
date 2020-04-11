const { Component } = require('aghanim')
const CustomComponent = require('../classes/custom-component')
const util = require('erisjs-utils')
const { Message, Guild } = require('erisjs-utils')
const enumFeeds = require('../enums/feeds')
const packageInfo = require('../package.json')
const odutil = require('../helpers/opendota-utils')

module.exports = class Bot extends CustomComponent() {
    constructor(client, options) {
        super(client)
    }
    ready() {
        this.waitOnce('cache:init', () => {
            this.dbOnce('bot').then(snap => {
                this.client.config.switches = snap.switches
                if (!this.client.isProduction) {
                    this.client.config.switches.leaderboardUpdate = false;
                    this.client.config.switches.backupdb = false;
                }
                //flags DEVMODE
                if (!this.client.isProduction && process.argv.includes('-db') ) {
                    this.client.config.switches.backupdb = true;
                    this.client.logger.dev('DB active')
                }
                if (!this.client.isProduction && process.argv.includes('-ul')) {
                    this.client.config.switches.leaderboardUpdate = true;
                    this.client.logger.dev('DB active - UPDATE Leaderboard')
                }

                this.client.config.playing = snap.playing;
                this.client.config.status = snap.status;
                this.client.config.status_act = snap.status_act;
                this.client.config.status_url = snap.status_url
                this.client.config.status_msg = snap.status_msg
                
                this.setStatus(this.client.config.status_act, this.client.config.status, this.client.config.status_msg, this.client.config.status_url, false).then(() => this.client.logger.ready('Status set'))

                if (this.client.config.switches.backupdb) { //config.switches.backupdb
                    util.Firebase.backupDBfile(this.client.db, this.client, this.client.config.guild.backup, { filenameprefix: 'roshan_db_', messageprefix: '**Roshan Backup DB**' }).then(snap => {
                        this.client.logger.info('Backup', 'Done!')

                        //Update leaderboard (Firebase) each this.client.config.hoursLeaderboardUpdate at least
                        if (this.client.config.switches.leaderboardUpdate
                            && (this.client.config.constants.hoursLeaderboardUpdate * 3600 + snap.leaderboard.updated) < new Date().getTime() / 1000) {
                            this.updateLeaderboard(snap.profiles)
                        }

                        //Update public (Firebase)
                        const data_public = {
                            discord_invite: this.client.config.invite,
                            discord_server: this.client.config.server,
                            users: Object.keys(snap.profiles).length,
                            servers: Object.keys(snap.servers).length,
                            version: packageInfo.version
                        }
                        this.client.db.child('public').update(data_public).then(() => this.client.logger.info('Publicinfo updated'))

                        // Check guilds config setted
                        this.client.guilds.forEach(g => {
                            if (!this.client.cache.servers.get(g.id)) {
                                this.components.Guild.createProcess(g).then(() => this.client.logger.info(`${g.name} encontrado. Registrado en el bot.`))
                            }
                        })
                    })
                }
            })
        })
    }
    dbOnce(path){
        return new Promise((res,rej) => {
            this.client.db.child(path).once('value').then(snap => {
                if (snap.exists()) { res(snap.val()) }
            })
        })
    }
    setStatus(type, status, msg, url, update){
        this.client.config.status = status !== null ? status : this.client.config.status
        this.client.config.status_act = type !== null ? type : this.client.config.status_act
        this.client.config.status_msg = msg !== null ? msg : this.client.config.status_msg
        this.client.config.status_url = url !== null ? url : this.client.config.status_url
        let promises = []
        if (update) {
            promises.push(this.client.db.child('bot').update({ status: this.client.config.status, status_act: this.client.config.status_act, status_msg: this.client.config.status_msg, status_url: this.client.config.status_url }))
        }
        promises.push(this.client.editStatus(this.client.config.status, { name: this.client.config.status_msg, type: this.client.config.status_act, url: this.client.config.status_url }))
        return Promise.all(promises)
    }
    updateLeaderboard(snap) {
        if(snap){
            return Object.keys(snap).map(p => ({ discord_id: p, dota_id: snap[p].dota }))
                .filter(player => player.dota_id)
                .map(player => {
                    const guild = this.client.guilds.find(g => g.members.get(player.discord_id))
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
                        setTimeout(() => this.client.components.Opendota.player_steam(player.dota_id).then(dataArray => {
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
                    return this.client.db.child('leaderboard').set(update).then(() => this.client.logger.info('Ranking Updated'))
                })    
        }else{
            this.db.child('profiles').once('value').then((snap) => {
                if (!snap.exists()) { return this.logger.info('Not exists')}
                this.updateLeaderboard(snap.val())
            })
        }
        
    }
    sendImageStructure(msg, query, links, cmd) {
        if (!links[query]) { return msg.reply('cmd.wrongarg', { options: Object.keys(links).join(', '), cmd }) } // TODO wrongCmd
        const match = links[query]
        if (typeof match === 'object') {
            return util.Message.sendImage(match.file).then(buffer => {
                return msg.reply(match.msg, null, { file: buffer, name: match.name })
            })
        } else if (typeof query === 'string') {
            return msg.reply(match)
        }
    }
    parseText(text, mode) {
        if (typeof text != 'string') { return 'Unknown' }
        let newText = text;
        if (mode == 'nf') {
            newText = text.replace(new RegExp('`', 'g'), '\'')
        }
        return newText
    }
    isSupporterCheckMessageCreate(msg, args, client){
        const result = this.isSupporter(msg.author.id)
        if(!result){msg.reply('bot.onlysupporterfunction')}
        return result
    }
    isBetatesterCheckMessageCreate(msg, args, client){
        const result = this.isBetatester(msg.author.id)
        if(!result){msg.reply('bot.onlybetatesterfunction')}
        return result
    }
    isBetatester(id){
        return this.betatesters().includes(id)
    }
    isSupporter(id){
        return this.supporters().includes(id)
    }
    betatesters(){
        const set = new Set([this.client.owner.id,...Array.from(this.client.cache.betatesters),...this.client.server.membersWithRole(this.client.config.roles.betatester).map(m => m.id)])
        return Array.from(set)
    }
    supporters(){
        const set = new Set([this.client.owner.id,...Array.from(this.client.cache.supporters),...this.client.server.membersWithRole(this.client.config.roles.supporter).map(m => m.id)])
        return Array.from(set)
    }
}
