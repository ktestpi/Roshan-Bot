const { Plugin } = require('aghanim')
const { resetServerConfig } = require('../helpers/basic.js')
const { Datee, Guild, Member } = require('erisjs-utils')
const { UserError, ConsoleError } = require('../classes/errormanager.js')

module.exports = class Events extends Plugin {
    constructor(client, options) {
        super(client)
    }
    ready() {
    }
    messageCreate(msg){
        if (this.client.config.guild.feedsHidden === msg.channel.id
        && this.client.config.switches.feeds
        && this.client.config.webhooks.feedsHidden === msg.author.id) { // AutoFeeds
            this.client.messageAllGuilds(msg, false, 'feeds')
            msg.addReaction(this.client.config.emojis.default.feeds)
        } else if (msg.channel.id === this.client.config.guild.changelog) { // Update Bot Changelog
            this.loadLastPatchNotes()
        }
    }
    guildCreate(guild){
        this.client.createMessage(this.client.config.guild.notifications, {
            embed: {
                title: 'Nuevo servidor',
                description: "**Nombre:** `" + guild.name + "`\n**ID:** `" + guild.id + "`\n**Miembros:** `" + guild.memberCount
                    + "`\n**Propietari@:** `" + guild.members.get(guild.ownerID).username + "`\n**Región:** `" + guild.region + "`\n**Creado:** `" + Datee.custom(guild.createdAt, 'D/M/Y h:m:s', true) + "`",
                thumbnail: { url: guild.iconURL || this.client.user.avatarURL, height: 40, width: 40 },
                footer: { text: guild.name + ' | ' + guild.id + ' | ' + Datee.custom(guild.joinedAt, 'D/M/Y h:m:s', true), icon_url: this.client.user.avatarURL },
                color: this.client.config.color
            }
        })
        resetServerConfig(this.client, guild)
            .then(() => {
                this.client.notifier.guildnew(`**${guild.name}**`)
                const defaultChannel = Guild.getDefaultChannel(guild, this, true)
                if (defaultChannel) {
                    defaultChannel.createMessage(`:flag_gb: Hi, I am a **Dota 2** and **Artifact** bot. Read the **server guide**: use \`r!getstarted\``)
                }
            })
            .catch(err => this.client.errorManager.emit(new ConsoleError('guildcreating', `Error creating server config for **${guild.name}** (${guild.id})`)))//TODO ErrorManager
    }
    messageReactionAdd(msg, emoji, userID){
        if (userID === this.client.owner.id && msg.channel.guild && msg.channel.guild.id === this.client.config.guild.id) {
            if (emoji.name === this.client.config.emojis.default.notification) {
                msg.channel.getMessage(msg.id).then(m => { this.client.messageAllGuilds(m, false, 'notifications') })
            } else if (emoji.name === this.client.config.emojis.default.loudspeaker) {
                msg.channel.getMessage(msg.id).then(m => { this.client.messageAllGuilds(m, true, 'notifications') })
            } else if (emoji.name == this.client.config.emojis.default.feeds) {
                msg.channel.getMessage(msg.id).then(m => { this.client.messageAllGuilds(m, false, 'feeds') })
            }
        } else if (userID === this.client.owner.id && emoji.name === this.client.config.emojis.default.trophy) {
            // && msg.author.id === this.client.user.id && msg.embeds[0] && msg.embeds[0].title === 'Nuevo torneo'
            msg.channel.getMessage(msg.id).then(m => {
                if (m.author.id === this.client.config.webhooks.fromapp && m.embeds[0] && m.embeds[0].title === 'Nuevo torneo') {
                    const embed = m.embeds[0]
                    const data = {
                        [embed.fields[0].value]: {
                            by: ndToVoidString(embed.fields[1].value),
                            start: ndToVoidString(embed.fields[2].value, true),
                            finish: ndToVoidString(embed.fields[3].value, true),
                            until: ndToVoidString(embed.fields[4].value, true),
                            img: ndToVoidString(embed.thumbnail.url),
                            link: ndToVoidString(embed.fields[5].value),
                            info: ndToVoidString(embed.description),
                            ts: Datee.now()
                        }
                    }
                    this.client.db.child('tourneys').update(data).then(() => m.addReaction(this.client.config.emojis.default.accept))
                }
            })
        }
        if (msg.channel.guild && emoji.name === this.client.config.emojis.default.pin) {
            const member = msg.channel.guild.members.get(userID)
            if (Member.hasRole(member, this.client.config.roles.aegis)) {
                msg.channel.getMessage(msg.id).then(m => {
                    if (!m.pinned) { m.pin() } //else { m.unpin() }
                })
            }
        }
    }
    messageReactionRemove(msg, emoji, userID) {
        if (msg.channel.guild && emoji.name === this.client.config.emojis.default.pin) {
            const member = msg.channel.guild.members.get(userID)
            if (Member.hasRole(member, this.client.config.roles.aegis)) {
                msg.channel.getMessage(msg.id).then(m => {
                    if (m.pinned) { m.unpin() } //else { m.unpin() }
                })
            }
        }
    }
    guildMemberAdd(guild, member){
        if (guild.id !== this.client.config.guildID) { return };
        if (this.client.config.switches.welcome) {
            const mentionAdmin = Guild.getRole(guild, this.client.config.roles.admin);
            if (mentionAdmin) {
                // this.createMessage(guild.id, this.replace.do('roshanGuildnewMemberWelcome', { member: member.mention }, true));
            }
        }
        this.client.notifier.memberin(`**${member.username}**`)
    }
    guildMemberRemove(guild, member){
        if (guild.id !== this.client.config.guildID) { return }
        this.client.notifier.memberout(`**${member.username}**`)
    }
}

function ndToVoidString(text, int) { return text === 'ND' ? '' : int ? parseInt(text) : text }