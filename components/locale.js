const { Component } = require('aghanim')
const util = require('erisjs-utils')
const path = require('path')
const LocaleClass = require('../classes/locale.js')
const packageInfo = require('../package.json')

module.exports = class Locale extends Component {
    constructor(client, options) {
        super(client)
        this.client.locale = new LocaleClass(path.join(process.cwd(), 'locale'), {}, { defaultLanguage: 'en', devLanguage: 'en' })
    }
    ready() {
        this.client.config.emojis.bot = util.Guild.loadEmojis(this.client.server)
        const localeCommands = {}
        this.client.commands.forEach(command => {
            localeCommands['cmd_' + command.name] = command.name
            if(command.subcommands.length){
                command.subcommands.forEach(subcommand => {
                    localeCommands['cmd_' + command.name + '_' + subcommand.name] = command.name + ' ' + subcommand.name
                })
            }
        })
        this.client.locale.addConstants({ //Create a replacer with bot info + emojis + lang
            bot_name: this.client.user.username,
            bot_icon: this.client.user.avatarURL,
            bot_avatar: this.client.user.avatarURL,
            author_name: this.client.owner.username,
            author_id: this.client.owner.id,
            channel_bugs: "<#" + this.client.config.guild.bugs + ">",
            channel_biblioteca: "<#" + this.client.config.guild.biblioteca + ">",
            channel_foso: "<#" + this.client.config.guild.id + ">",
            server: this.client.config.server,
            version: packageInfo.version,
            update: packageInfo.version_date,
            link_patreon: this.client.config.links.patreon,
            link_kofi: this.client.config.links.kofi,
            link_web: this.client.config.links.web,
            link_web_leaderboard: this.client.config.links.web_leaderboard,
            link_web_addtourney: this.client.config.links.web_addtourney,
            link_web_feeds: this.client.config.links.web_feeds,
            link_invite: this.client.config.invite,
            link_devserver: this.client.config.server,
            link_web_playercard_bg_gallery: this.client.config.links.web_playercard_bg_gallery,
            link_web_features: this.client.config.links.web_features,
        })
        this.client.locale.addConstants(this.client.config.emojis.bot)
        this.client.locale.addConstants(localeCommands)
        this.client.components.Notifier.console('Locale','Ready')
    }
}