const { Component } = require('aghanim')
const util = require('erisjs-utils')
const FirebaseCollection = require('../classes/firebasecollection.js')
const FireSetCache = require('../classes/firesetcache')

module.exports = class Cache extends Component {
    constructor(client, options) {
        super(client)
        this.client.cache = {}
    }
    ready() {
        this.update().then(() => { this.client.emit('cache:init')})
    }
    messageCreate(msg){
        if (msg.channel.id === this.client.config.guild.changelog) { // Update Bot Changelog
            return this.loadLastPatchNotes()
        }
    }
    update(){
        return new Promise((res,rej) => {
            this.client.cache = {}
            this.loadLastPatchNotes()
            this.updateTorneysFeeds()
            this.loadDota2Patch()
            if(this.client.envprod || process.argv.includes('-db')){
                this.client.db.once('value').then(snap => {
                    if (!snap.exists()) { this.client.errors.emit(new ConsoleError('cacheReload', 'Error al recargar')) } else { snap = snap.val() }
                    this.updateWithSnap(snap)
                    res()
                })
            }else{
                this.updateFake()
                res()
            }
        })
    }
    updateWithSnap(snap){
        this.client.cache.profiles = new FirebaseCollection(snap.profiles, this.client.db.child('profiles'))
        this.client.cache.servers = new FirebaseCollection(snap.servers, this.client.db.child('servers'))
        this.client.cache.decks = new FirebaseCollection(snap.decks, this.client.db.child('decks'))
        this.client.cache.betatesters = new FireSetCache(this.client.db.child('betatesters'), [...(snap.betatesters ? Object.keys(snap.betatesters) : [])])
        this.client.cache.supporters = new FireSetCache(this.client.db.child('supporters'), [...(snap.supporters ? Object.keys(snap.supporters) : [])])
        this.client.components.Notifier.console('Cache from DB')
    }
    updateFake(){
        this.client.cache.profiles = new FirebaseCollection({ "189996884322942976": { lang: 'es', card: { bg: '1', pos: 'carry-es', heroes: '1,2,3' }, dota: '112840925', steam: '76561198073106653' }, "314083101129310208": { lang: 'en', card: { bg: '1', pos: 'all', heroes: '1,2,3' }, dota: '112840925', steam: '76561198073106653' } }, this.client.db.child('profiles'));
        this.client.cache.servers = new FirebaseCollection({
            "327603106257043456": { lang: 'es', notifications: { enable: true, channel: "491295737251102733" }, feeds: { enable: true, channel: "491295737251102733", subs: "1,2,3" } },
            "332023803691532289": { lang: 'es', notifications: { enable: true, channel: "332023803691532289" }, feeds: { enable: true, channel: "332023803691532289", subs: "1,2,3" } }
        }, this.client.db.child('servers'))
        this.client.cache.decks = new FirebaseCollection(this.client.db.child('decks'))
        this.client.cache.betatesters = new FireSetCache(this.client.db.child('betatesters'))
        this.client.cache.supporters = new FireSetCache(this.client.db.child('supporters'))
        this.client.components.Notifier.console('Cache','Faked')
    }
    updateTorneysFeeds(){
        this.client.cache.feeds = new FirebaseCollection(this.client.db.child('feeds'))
        this.client.cache.feeds.on('value', function(snap) {
            if(snap.exists()){
                this.clear()
                snap = snap.val()
                Object.keys(snap).forEach(key => this.add(key,snap[key]))
            }
        })
        this.client.cache.feeds.order = function () {
            return this.sort(function (a, b) {
                a = parseInt(a._id)
                b = parseInt(b._id)
                return b - a
            })
        }

        this.client.cache.tourneys = new FirebaseCollection(this.client.db.child('tourneys'))
        this.client.cache.tourneys.on('value', function(snap) {
            if (snap.exists()) {
                this.clear()
                snap = snap.val()
                Object.keys(snap).forEach(key => this.add(key, snap[key]))
            }
        })
        this.client.cache.tourneys.order = function () {
            return this.bucket.sort(sortTourneys)
        }
        this.client.cache.tourneys.getPlaying = function () {
            const now = util.Date.now()
            return this.filter(t => t.start < now && now < t.finish)
        }
        this.client.cache.tourneys.getNext = function () {
            const now = util.Date.now()
            return this.filter(t => (t.until && now < t.until) || (t.start && now < t.start))
        }
        this.client.components.Notifier.console('Cache','Tournaments and Feeds loaded')
    }
    loadLastPatchNotes(){
        return this.client.getMessage(this.client.config.guild.changelog, this.client.server.channels.get(this.client.config.guild.changelog).lastMessageID).then(m => {
            this.client.cache.botPatchNotes = m.content
            this.client.components.Notifier.console('Patch notes','Loaded')
        })
    }
    loadDota2Patch(){
        return this.client.db.child('bot/patch').once('value').then(snap => this.client.cache.dota2Patch = snap.val())
    }
}
