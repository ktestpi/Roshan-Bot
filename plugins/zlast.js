const { Plugin } = require('aghanim')
const packageInfo = require('../package.json')

module.exports = class Last extends Plugin {
    constructor(client, options) {
        super(client)
    }
    ready() {
        this.client.db.child('bot').once('value').then(snap => {
            if (!snap.exists()) { return } else { snap = snap.val() }
            this.client.config.switches = snap.switches
            if (!this.client.envprod) {
                // this.client.notifier.console('Creating a fake DB...');
                this.client.config.switches.leaderboardUpdate = false;
                this.client.config.switches.backupdb = false;
                // this.client.cache.profiles = new FirebaseCache(this.client.db.child('profiles'),{"189996884322942976" : {lang : 'es', card : {bg : '0', pos : 'all', heroes : '1,2,3'}, profile : {dota : '112840925', steam : '76561198073106653', twitch : '', twitter : ''}}});
                // this.client.cache.servers = new FirebaseCache(this.client.db.child('servers'),{"327603106257043456" : {lang : 'es', notifications : {enable : true, channel : "491295737251102733"}, feeds : {enable : true, channel : "491295737251102733", subs : "1,2,3"}},
                //   "332023803691532289" : {lang : 'es', notifications : {enable : true, channel : "332023803691532289"}, feeds : {enable : true, channel : "332023803691532289", subs : "1,2,3"}}})
                // this.client.cache.betatesters = new FireSetCache(this.client.db.child('betatesters'),[this.client.owner.id,...this.client.server.membersWithRole(this.client.config.roles.betatester).map(m => m.id)])
                // this.client.cache.supporters = new FireSetCache(this.client.db.child('supporters'),[...this.client.server.membersWithRole(this.client.config.roles.supporter).map(m => m.id)])
            }
            
            //flags DEVMODE
            if (!this.client.envprod && process.argv[2] === '--db') {
                this.client.config.switches.backupdb = true;
                this.client.notifier.console('DEV - DB active')
            } else if (!this.client.envprod && process.argv[2] === '--dbu') {
                this.client.config.switches.backupdb = true;
                this.client.config.switches.leaderboardUpdate = true;
                this.client.notifier.console('DEV - DB active - UPDATE Leaderboard')
            }
            this.client.config.playing = snap.playing;
            this.client.config.status = snap.status;
            this.client.config.status_act = snap.status_act;
            this.client.config.status_url = snap.status_url
            this.client.config.status_msg = snap.status_msg
            this.client.setStatus(this.client.config.status_act, this.client.config.status, this.client.config.status_msg, this.client.config.status_url, false).then(() => this.client.notifier.console('Status setted'))
            this.client.emit('postready')
        }).catch(err => { this.client.notifier.console('Error', err); this.client.emit('postready') })
        
        
        this.client.on('postready', function () {
            // console.log(this)
            if (this.config.switches.backupdb) { //config.switches.backupdb
                util.Firebase.backupDBfile(this.db, this, this.config.guild.backup, { filenameprefix: 'roshan_db_', messageprefix: '**Roshan Backup DB**' }).then(snap => {
                    this.notifier.console('Backup done!')

                    //Create cache maps for Profiles and Servers (Firebase)
                    // this.cache.profiles = new FirebaseCache(this.db.child('profiles'), Object.keys(snap.profiles).map(profile => [profile, snap.profiles[profile]]));
                    // this.cache.servers = new FirebaseCache(this.db.child('servers'), snap.servers);

                    //Update leaderboard (Firebase) each this.client.config.hoursLeaderboardUpdate at least
                    if (this.config.switches.leaderboardUpdate
                        && (this.config.constants.hoursLeaderboardUpdate * 3600 + snap.leaderboard.updated) < new Date().getTime() / 1000) {
                        updateLeaderboard(this, snap.profiles)
                    }

                    //Update public (Firebase)
                    const data_public = {
                        discord_invite: this.config.invite,
                        discord_server: this.config.server,
                        users: Object.keys(snap.profiles).length,
                        version: packageInfo.version
                    }
                    this.db.child('public').update(data_public).then(() => this.notifier.console('Update public Info'))

                    // Update accounts schema
                    // Object.keys(snap.profiles).map(p => ({_id : p, data : snap.profiles[p]})).forEach(p => {
                    //   p.data.card.pos = 'all'
                    //   p.data.card.bg = '0'
                    //   this.db.child('profiles/'+p._id).update(updateAccountSchema(p.data))
                    // })

                    // this.cache.betatesters = new FireSetCache(this.db.child('betatesters'),[this.owner.id,...this.server.membersWithRole(this.config.roles.betatester).map(m => m.id),...snap.betatesters ? Object.keys(snap.betatesters).filter(b => snap.betatesters[b]) : []])
                    // this.cache.supporters = new FireSetCache(this.db.child('supporters'),[...this.server.membersWithRole(this.config.roles.supporter).map(m => m.id),...snap.supporters ? Object.keys(snap.supporters).filter(b => snap.betatesters[b]) : []])

                    // this.cache.feeds = new FireListenCache(this.db.child('feeds'))
                    // this.cache.feeds.order = function(){
                    //   return this.bucket.sort(function(a,b){
                    //     a = parseInt(a._id)
                    //     b = parseInt(b._id)
                    //     return b-a
                    //   })
                    // }

                    // Check guilds config setted
                    this.guilds.forEach(g => {
                        if (!this.cache.servers.get(g.id)) {
                            resetServerConfig(this, g).then(() => this.notifier.bot(`${g.name} encontrado. Registrado en el bot.`))
                        }
                    })

                    // // Diretide Cache
                    // Diretide.cache.users = new FirebaseCache(this.client.db.child('diretide/users'),snap.diretide.users)
                    // Diretide.cache.teams = new FirebaseCache(this.client.db.child('diretide/teams'),snap.diretide.teams)

                    // //Diretide add DB
                    // Diretide.status.addDB(this.client.db.child('diretide/roshan'))

                    // // Diretide Autostart Game
                    // if(Diretide.config.autostart){
                    //   Diretide.status.randomSugarRush(Diretide.config.events.sugarrush.randomFirstStart)
                    // }
                })
            }
        })
    }
}

const updateLeaderboard = function (bot, snap) {
    return Object.keys(snap).map(p => ({ discord_id: p, dota_id: snap[p].profile.dota }))
        .filter(player => player.dota_id)
        .map(player => {
            const guild = bot.guilds.find(g => g.members.get(player.discord_id))
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
                setTimeout(() => bot.plugins.Opendota.player_steam(player.dota_id).then(dataArray => {
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
            return bot.db.child('leaderboard').set(update).then(() => bot.notifier.console('Ranking Updated'))
        })
}