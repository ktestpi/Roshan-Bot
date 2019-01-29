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
        this.client.config.emojis.bot = util.Guild.loadEmojis(this.client.server);
        
        this.client.locale.addConstants({ //Create a replacer with bot info + emojis + lang
            bot_name: this.client.user.username,
            bot_icon: this.client.user.avatarURL,
            author_name: this.client.owner.username,
            author_id: this.client.owner.id,
            channel_bugs: "<#" + this.client.config.guild.bugs + ">",
            channel_biblioteca: "<#" + this.client.config.guild.biblioteca + ">",
            channel_foso: "<#" + this.client.config.guild.id + ">",
            server: this.client.config.server,
            version: packageInfo.version,
            update: packageInfo.version_date
        })
        this.client.locale.addConstants(this.client.config.emojis.bot)
        this.client.notifier.console('Locale','Ready')
    }
}