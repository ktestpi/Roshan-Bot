const { Component, Eris } = require('aghanim')
const path = require('path')
const util = require('erisjs-utils')
const xlsx = require('xlsx')
const packageInfo = require('../package.json')
const EmbedBuilder = require('../classes/embed-builder.js')

module.exports = class Locale extends Component {
    constructor(client, options) {
        super(client)
        this.lang = {}
        this.languages = []
        this.constants = {}
        this.defaultLanguage = 'en'
        const self = this
        const wb = xlsx.readFile(path.join(__dirname,'../locale/locale.xlsx'))
        xlsx.utils.sheet_to_json(wb.Sheets.locale).forEach(row => {
            const langs = Object.keys(row).filter(key => key)
            langs.forEach(lang => {
                if (!this.lang[lang]) { this.lang[lang] = {}; this.languages.push(lang) }
                this.lang[lang][row['langkey']] = row[lang]
            })
        })
        Eris.Message.prototype.reply = function(content, replacements = {}, file, user_discord_id){
            if (typeof file === 'string') { user_discord_id = file; file = undefined}
            return this.channel.createMessage(reply(content, replacements, user_discord_id, this), file)
        }
        Eris.Message.prototype.replyDM = function (content, replacements, file, user_discord_id) {
            if (typeof file === 'string') { user_discord_id = file; file = undefined }
            return this.author.getDMChannel()
                .then(channel => channel.createMessage(reply(content, replacements, user_discord_id, this), file))
        }
        function reply(content, replacements = {}, user_discord_id, msg, fn){
            const user = (user_discord_id && self.client.users.get(user_discord_id)) || msg.author
            const user_name = replacements.user_name || user.username
            const user_id = replacements.user_id || user.id
            const user_avatar = replacements.user_avatar || user.avatarURL
            const user_lang = replacements.user_lang || user.account.lang
            const account_dota = replacements.account_dota || user.account.dota
            const account_steam = replacements.account_steam || user.account.steam
            replacements = Object.assign(replacements, { user_name, user_id, user_avatar, user_lang, account_dota, account_steam })
            return self.replaceFromMsg(content, replacements, msg)
        }
        Eris.User.prototype.locale = function (content, replacements) {
            return self.replacer(content, replacements, this.account.lang)
        }
        Eris.Guild.prototype.locale = function (content, replacements) {
            return self.replacer(content, replacements, this.account.lang)
        }
    }
    ready() {
        this.client.config.emojis.bot = util.Guild.loadEmojis(this.client.server)
        const localeCommands = {}
        this.client.commands.forEach(command => {
            localeCommands['cmd_' + command.name] = command.name
            if (command.subcommands.length) {
                command.subcommands.forEach(subcommand => {
                    localeCommands['cmd_' + command.name + '_' + subcommand.name] = command.name + ' ' + subcommand.name
                })
            }
        })
        this.addConstants(this.client.config.emojis.bot)
        this.addConstants(localeCommands)
        this.addConstants({ //Create a replacer with bot info + emojis + lang
            bot_name: this.client.user.username,
            bot_icon: this.client.user.avatarURL,
            bot_avatar: this.client.user.avatarURL,
            author_name: this.client.owner.username,
            author_id: this.client.owner.id,
            channel_bugs: "<#" + this.client.config.guild.bugs + ">",
            channel_biblioteca: "<#" + this.client.config.guild.biblioteca + ">",
            channel_foso: "<#" + this.client.config.guild.id + ">",
            server: this.client.config.server,
            bot_version: packageInfo.version,
            bot_update: packageInfo.version_date,
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
        this.client.components.Notifier.console('Locale', 'Ready')
    }
    addConstants(constants){
        this.constants = Object.assign(this.constants, constants)
    }
    replaceFromMsg( content, replacements, msg){
        if (typeof content === 'string') {
            return this.replacer(content, replacements, msg.author.account.lang)
        } else if (content instanceof EmbedBuilder) {
            return content.build(msg._client, msg.author.account.lang, replacements)
        }
        return content
    }
    replacer(string, replacements, lang){
        lang = (this.lang[lang] && lang) || this.defaultLanguage
        string = this.getString(string, lang)
        const reg = /%%([\w\._^%+]+)%%/g
        const injected = []
        let match
        while (match = reg.exec(string)) {
            injected.push(match[1])
        }
        injected.forEach(injectKey => {
            const inject = this.getString(injectKey, lang)
            if (inject) {
                string = string.replace(new RegExp(`%%${injectKey}%%`, 'g'), inject)
            }
        })
        for (let str in this.constants) {
            string = string.replace(new RegExp(`<${str}>`, 'g'), this.constants[str]) // Replace
        }
        for (let str in replacements) {
            string = string.replace(new RegExp(`<${str}>`, 'g'), replacements[str]) // Replace
        }
        return string
    }
    getString(key, language){
        return (this.lang[language] && this.lang[language][key]) || key
    }
    flags(){
        return [{ flag: '🇺🇸', lang: 'en' },{ flag: '🇪🇸', lang: 'es' }]
    }
    getFlag(lang){
        return this.flags().find(f => f.lang === lang).flag
    }
}

