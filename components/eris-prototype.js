const { Component } = require('aghanim')
const EmbedBuilder = require('../classes/embed-builder.js')
const { Eris } = require('aghanim')

module.exports = class ErisPrototype extends Component{
    constructor(client, options){
        super(client)
        Eris.Guild.prototype.membersWithRole = function (roleName) {
            const role = this.roles.find(r => r.name === roleName)
            return role ? this.members.filter(m => m.roles.includes(role.id)) : []
        }

        Eris.Message.prototype.addReactionSuccess = function () {
            return this.addReaction(this._client.config.emojis.default.accept)
        }

        Eris.Message.prototype.addReactionFail = function () {
            return this.addReaction(this._client.config.emojis.default.error)
        }

        Eris.Message.prototype.addReactionSending = function () {
            return this.addReaction(this._client.config.emojis.default.envelopeIncoming)
        }

        Object.defineProperty(Eris.User.prototype, 'account', {
            get: function () {
                const account = client.cache.profiles.get(this.id) || client.components.Account.schema()
                return account
            }
        })

        Object.defineProperty(Eris.User.prototype, 'registered', {
            get: function () {
                return client.cache.profiles.has(this.id)
            },
            enumerable: true
        })

        Object.defineProperty(Eris.User.prototype, 'supporter', {
            get: function () {
                return client.components.Users.isSupporter(this.id)
            },
            enumerable: true
        })

        Object.defineProperty(Eris.User.prototype, 'betatester', {
            get: function () {
                return client.components.Users.isBetatester(this.id)
            },
            enumerable: true
        })

        Object.defineProperty(Eris.User.prototype, 'profile', {
            get: function () {
                return {
                    account: this.account,
                    supporter: this.supporter,
                    betatester: this.betatester,
                    registered: this.registered
                }
            },
            enumerable: true
        })

        Object.defineProperty(Eris.Guild.prototype, 'account', {
            get: function () {
                const account = client.cache.servers.get(this.id) || client.components.Account.schema()
                return account
            }
        })

        Object.defineProperty(Eris.Guild.prototype, 'registered', {
            get: function () {
                return client.cache.servers.has(this.id)
            },
            enumerable: true
        })

        // Object.defineProperty(Eris.User.prototype.account, 'log', {
        //   get: function () {
        //     // const account = client.cache.profiles.get(this.id)
        //     console.log(this)
        //     // return account
        //   }
        // })

        // Eris.Message.prototype.reply = function (content, file) {
        //   return new Promise((resolve, reject) => {
        //     this.channel.createMessage(content, file)
        //       .then(m => resolve(m))
        //       .catch(err => reject(err))
        //   })
        // }

        // Eris.Message.prototype.replyDM = function (content, file) {
        //   return new Promise((resolve, reject) => {
        //     this.author.getDMChannel()
        //       .then(channel => channel.createMessage(content, file))
        //       .then(m => resolve(m))
        //       .catch(err => reject(err))
        //   })
        // }

        Eris.Message.prototype.reply = function (content, replacements, file) {
            return new Promise((resolve, reject) => {
                this.channel.createMessage(parseContent(content, replacements, this), file)
                    .then(m => resolve(m))
                    .catch(err => reject(err))
            })
        }

        Eris.Message.prototype.replyDM = function (content, replacements, file) {
            return new Promise((resolve, reject) => {
                this.author.getDMChannel()
                    .then(channel => channel.createMessage(parseContent(content, replacements, this), file))
                    .then(m => resolve(m))
                    .catch(err => reject(err))
            })
        }

        function parseContent(content, replacements, msg) {
            if (typeof content === 'string') {
                const lang = msg._client.locale.getUserStrings(msg)
                return client.locale.replacer(lang[content] || content, replacements)
            } else if (content instanceof EmbedBuilder) {
                return content.build(msg._client, msg._client.locale.getUserLang(msg), replacements)
            }
            return content
        }
    }
}