const { Request } = require('erisjs-utils')
const { accountSchema } = require('../helpers/basic.js')

const baseURL = 'https://api.opendota.com/api/'

const Endpoints = {
    player: 'players/<id>',
    player_wl: 'players/<id>/wl',
    player_heroes: 'players/<id>/heroes',
    player_totals: 'players/<id>/totals',
    player_matches: 'players/<id>/matches?significant=0',
    player_pros: 'players/<id>/pros',
    player_friends: 'players/<id>/peers?date=30',
    match: 'matches/<id>',
    competitive: 'proMatches/',
    proplayers: 'proPlayers/',
    search_player: 'search?q=<id>&similarity=0.5',
    search_pro: 'proPlayers/'
}

const urls = {
    card: [Endpoints.player],
    card_heroes: [Endpoints.player, Endpoints.player_heroes],
    player: [Endpoints.player, Endpoints.player_wl, Endpoints.player_heroes, Endpoints.player_totals],
    player_matches: [Endpoints.player, Endpoints.player_matches],
    player_lastmatch: [Endpoints.player_matches],
    player_friends: [Endpoints.player, Endpoints.player_friends],
    player_pros: [Endpoints.player, Endpoints.player_pros],
    player_steam: [Endpoints.player],
    match: [Endpoints.match],
    competitive: [Endpoints.competitive],
    search_player: [Endpoints.search_player],
    search_pro: [Endpoints.search_pro]
}

const decorator = (f,urls) => id => f(urls,id)

class Opendota{
    constructor(client,db){
        this.client = client
        this.baseURL = baseURL
        this._calls = 0
        this.db = this.client.db.child(db)
        Object.keys(urls).forEach(key => {
            this[key] = decorator(this.request.bind(this),urls[key].map(url => this.baseURL + url))
        })
        this.db.once('value').then((snap) =>{
            this._calls = snap.exists() ? snap.val().odcalls : 0
            const date = new Date()
            if(date.getDate() === 1){
                this.save(0)
            }
        })
    }
    url(name){
        return Endpoints[name]
    }
    request(urls,id){
        return Request.getJSONMulti(urls.map(url => replace(url, '<id>', id)))
            .then(results => {
                return this.incremental(results.length).then(() => results)
                }
            )
    }
    get calls(){
        return this._calls
    }
    set calls(value){
        return this.save(value)
    }
    save(value){
        const update = { odcalls: value === undefined ? this._calls : value}
        this._calls = update.odcalls
        return this.db.update(update)
    }
    incremental(add){
        this._calls += add || 0
        return this.save(this._calls)
    }
    userID(msg,args){
        return new Promise((res, rej) => {
            let id
            if(msg.mentions.length > 0){
                res(this.baseProfile(msg.mentions[0]))
            }else if(args[1]){
                const number = parseInt(args[1])
                if(!isNaN(number)){
                    res(this.baseProfile(undefined, number))
                }else{
                    this.getProPlayerID(args.from(1)).then(player => res(this.baseProfile(undefined, player.account_id)))
                }
            }else{
                res(this.baseProfile(msg.author.id))
            }
        })
        if (cachePlayerID) {
            base.isCached = true; base.isDiscordID = false;
            profile = Object.assign({}, base, cachePlayerID)
        } else {
            profile = Object.assign({}, base, module.exports.accountSchema())
        }
        return profile
    }
    baseProfile(discordID,dotaID){
        const cache = this.client.cache.profiles.get(discordID)
        const data = cache || accountSchema()
        if(dotaID){data.profile.dota = dotaID}
        return { discordID, cached: cache ? true : false, data }
    }
    error(msg, err){
        return this.client.discordLog.send('oderror', this.client.locale.getDevString('errorOpendotaRequest', msg), this.client.locale.getUserString('errorOpendotaRequest', msg), err, msg.channel)
    }
    userCall(msg,args){
        return this.userID(msg,args).then(playerID => new Promise((res,rej) => {
            
        }))
    }
    getProPlayerID(name){
        return new Promise((resolve, reject) => {
            const urls = ['https://api.opendota.com/api/proPlayers/'];
            this.request(urls).then((results) => {
                let pro = results[0].find(player => player.name.toLowerCase() === name.toLowerCase())
                if (pro) { resolve(pro) } else { reject("getProPlayerDotaID not found") };
            })
        })
    }
    getProPlayersDotaName(query) { //Promise
        return new Promise((resolve, reject) => {
            this.search_pro(query).then((results) => {
                let pros = results[0].filter(player => player.name.toLowerCase().match(new RegExp(query.toLowerCase())))
                if (pros) { resolve(pros) } else { reject("getProPlayersDotaName not found") };
            }).catch(err => console.log(err))
        })
    }
    getPlayersDotaName(query) { //Promise
        return new Promise((resolve, reject) => {
            this.search_player(query).then((results) => {
                let players = results[0];
                if (players) { resolve(players) } else { reject("getPlayersDotaName not found") };
            }).catch(err => console.log(err))
        })
    }
}

const replace = (text, match, repl) => text.replace(match, repl)

module.exports = Opendota