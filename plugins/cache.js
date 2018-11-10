const { Plugin } = require('aghanim')
const FirebaseCache = require('../classes/firebasecache.js')
const FireListenCache = require('../classes/firelistencache.js')
const FireSetCache = require('../classes/firesetcache')
const util = require('erisjs-utils')

module.exports = class Cache extends Plugin {
    constructor(client, options) {
        super(client)
        this.client.cache = {}
    }
    ready() {
        this.update()
    }
    update(){
        this.client.cache = {}
        if(this.client.envprod){
            this.client.db.once('value').then(snap => {
                if (!snap.exists()) { this.client.errorManager.emit(new ConsoleError('cacheReload', 'Error al recargar')) } else { snap = snap.val() }
                this.updateWithSnap(snap)
            })
        }else{
            this.updateFake()
        }
        this.updateTorneysFeeds()
    }
    updateWithSnap(snap){
        this.client.cache.profiles = new FirebaseCache(this.client.db.child('profiles'), Object.keys(snap.profiles).map(profile => [profile, snap.profiles[profile]]));
        this.client.cache.servers = new FirebaseCache(this.client.db.child('servers'), snap.servers);
        this.client.cache.betatesters = new FireSetCache(this.client.db.child('betatesters'), [this.client.owner.id, ...this.client.server.membersWithRole(this.client.config.roles.betatester).map(m => m.id), ...snap.betatesters ? Object.keys(snap.betatesters).filter(b => snap.betatesters[b]) : []])
        this.client.cache.supporters = new FireSetCache(this.client.db.child('supporters'), [...this.client.server.membersWithRole(this.client.config.roles.supporter).map(m => m.id), ...snap.supporters ? Object.keys(snap.supporters).filter(b => snap.betatesters[b]) : []])
        this.client.notifier.console('Cache from DB')
    }
    updateFake(){
        this.client.cache.profiles = new FirebaseCache(this.client.db.child('profiles'), { "189996884322942976": { lang: 'en', card: { bg: '0', pos: 'all', heroes: '1,2,3' }, profile: { dota: '112840925', steam: '76561198073106653', twitch: '', twitter: '' } } });
        this.client.cache.servers = new FirebaseCache(this.client.db.child('servers'), {
            "327603106257043456": { lang: 'es', notifications: { enable: true, channel: "491295737251102733" }, feeds: { enable: true, channel: "491295737251102733", subs: "1,2,3" } },
            "332023803691532289": { lang: 'es', notifications: { enable: true, channel: "332023803691532289" }, feeds: { enable: true, channel: "332023803691532289", subs: "1,2,3" } }
        })
        this.client.cache.betatesters = new FireSetCache(this.client.db.child('betatesters'), [this.client.owner.id, ...this.client.server.membersWithRole(this.client.config.roles.betatester).map(m => m.id)])
        this.client.cache.supporters = new FireSetCache(this.client.db.child('supporters'), [...this.client.server.membersWithRole(this.client.config.roles.supporter).map(m => m.id)])
        this.client.notifier.console('Cache faked')
    }
    updateTorneysFeeds(){
        this.client.cache.feeds = new FireListenCache(this.client.db.child('feeds'))
        this.client.cache.feeds.order = function () {
            return this.bucket.sort(function (a, b) {
                a = parseInt(a._id)
                b = parseInt(b._id)
                return b - a
            })
        }

        this.client.cache.tourneys = new FireListenCache(this.client.db.child('tourneys'))
        this.client.cache.tourneys.order = function () {
            const now = util.Date.now()
            return this.bucket.sort(sortTourneys)
        }
        this.client.cache.tourneys.getPlaying = function () {
            const now = util.Date.now()
            return this.bucket.filter(t => t.start < now && now < t.finish)
        }
        this.client.cache.tourneys.getNext = function () {
            const now = util.Date.now()
            return this.bucket.filter(t => (t.until && now < t.until) || (t.start && now < t.start))
        }
        this.client.notifier.console('Cache Tournaments and Feeds')
    }
}