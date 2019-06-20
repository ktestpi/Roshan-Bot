const { Component } = require('aghanim')
const { Request, Markdown } = require('erisjs-utils')
const { UserError, ConsoleError } = require('../classes/errors.js')

module.exports = class Opendota extends Component {
    constructor(client, options) {
        super(client)
        this.baseURL = baseURL
        this._calls = 0
        this.db = this.client.db.child('botstats')
        Object.keys(urls).forEach(key => {
            this[key] = decorator(this.request.bind(this), urls[key].map(url => this.baseURL + url))
        })
        this.db.once('value').then((snap) => {
            this._calls = snap.exists() ? snap.val().odcalls : 0
            const date = new Date()
            if (date.getDate() === 1) {
                this.save(0)
            }
        })
    }
    // FIXME: Maybe use new Poxy to intercept fetches before done (cache system?) for url profile? within time interval
    // function fn(param) {
    //     return new Promise((res, rej) => {
    //         setTimeout(() => res(param + 'response'), 1000)
    //     })
    // }

    // function createProxy(time) {
    //     let cache = {}
    //     return new Proxy(fn, {
    //         apply(target, thisArg, args) {
    //             const req = args[0]
    //             console.log(cache[req], Date.now())
    //             if (cache[req] && cache[req].time) {
    //                 console.log(cache[req].time > Date.now() - time * 1000)
    //             }
    //             if (cache[req] && cache[req].time > Date.now() - time * 1000) {
    //                 return Promise.resolve('Response cached: ' + cache[req].response)
    //             } else {
    //                 return target.apply(thisArg, args).then(response => {
    //                     cache[req] = { response, time: Date.now() }
    //                     return response
    //                 })
    //             }
    //         }
    //     })
    // }
    // const proxy = createProxy(1)
    // proxy(1).then((res) => { console.log(res); proxy(1).then(console.log) })
    // proxy(1).then(console.log)
    request(urls, id) {
        return Request.getJSONMulti(urls.map(url => replace(url, '<id>', id)))
            .then(results => {
                return this.incremental(results.length).then(() => results)
            }
        )
    }
    get calls() {
        return this._calls
    }
    set calls(value) {
        return this.save(value)
    }
    save(value) {
        const update = { odcalls: value === undefined ? this._calls : value }
        this._calls = update.odcalls
        return process.env.NODE_ENV === 'production' ? this.db.update(update) : Promise.resolve()
    }
    incremental(add) {
        this._calls += add || 0
        return this.save(this._calls)
    }
    needRegister(msg, account) {
        return !account.data.dota ? true : false
    }
    existsAuthor(msg){
        return new Promise((res,rej) => {
            const profile = this.baseProfile(msg.author.id)
            if (this.needRegister(msg, profile)) { throw new UserError('opendota', 'bot.needregister') }
            res(profile)
        })
    }
    userID(msg, args) {
        return new Promise((res, rej) => {
            if (msg.mentions.length > 0) {
                const profile = this.baseProfile(msg.mentions[0].id)
                if (this.needRegister(msg, profile)) { throw new UserError('opendota', 'bot.Mentioned', { username: msg.channel.guild.members.get(msg.mentions[0].id).username }) }
                res(profile)
            } else if (args[1]) {
                const number = parseInt(args[1])
                if (!isNaN(number)) {
                    res(this.baseProfile(undefined, number))
                } else {
                    this.getProPlayerID(args.from(1)).then(player => res(this.baseProfile(undefined, player.account_id))).catch(err => rej(new UserError('opendota', 'error.pronotfound', { pro: args.from(1)})))
                }
            } else {
                const profile = this.baseProfile(msg.author.id)
                if (this.needRegister(msg, profile)) { throw new UserError('opendota', 'needRegister') }
                res(profile)
            }
        })
    }
    baseProfile(discordID, dotaID) {
        const cache = this.client.cache.profiles.get(discordID)
        const data = cache || this.client.components.Account.schema()
        const profile = this.client.components.Users.getProfile(discordID)
        if (dotaID) { data.dota = dotaID }
        return { discordID, cached: cache ? true : false, data, profile}
    }
    userCall(msg, args) {
        return this.userID(msg, args).then(playerID => new Promise((res, rej) => {

        }))
    }
    getProPlayerID(name) {
        return new Promise((resolve, reject) => {
            const urls = [this.baseURL + Endpoints.search_pro] //['https://api.opendota.com/api/proPlayers/'];
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
    search_pro: 'proPlayers/',
}

const urls = {
    account: [Endpoints.player],
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

const decorator = (f, urls) => id => f(urls, id)

const replace = (text, match, repl) => text.replace(match, repl)
