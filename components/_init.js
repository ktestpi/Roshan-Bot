const { Component, Eris } = require('aghanim')
const { Color } = require('erisjs-utils')

module.exports = class Init extends Component {
    constructor(client, options) {
        super(client)
        let CONFIG = require('../config.json')
        CONFIG.color = Color.convert(CONFIG.color, 'hex-int');
        for (let cat in CONFIG.colors) {
            if (typeof CONFIG.colors[cat] == 'string') {
                CONFIG.colors[cat] = Color.convert(CONFIG.colors[cat], 'hex-int')
                continue 
            }
            for (let c in CONFIG.colors[cat]) {
                CONFIG.colors[cat][c] = Color.convert(CONFIG.colors[cat][c], 'hex-int');
            }
        }
        this.client.config = CONFIG
        this.client.config.colors.palette = { default: CONFIG.color }

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
    }
    ready() {
        this.client.server = this.client.guilds.get(this.client.config.guild.id)
    }
}