const { Component } = require('aghanim')
const { Datee, Guild, Member } = require('erisjs-utils')

module.exports = class ServerEvents extends Component {
    constructor(client, options) {
        super(client)
    }
    messageReactionAdd(msg, emoji, userID, client){
        if (userID === this.client.owner.id && msg.channel.guild && msg.channel.guild.id === this.client.config.guild.id) {
            if (emoji.name === this.client.config.emojis.default.notification) {
                msg.channel.getMessage(msg.id).then(m => { this.client.components.Guild.messageAllGuilds(m, false, 'notifications') })
            } else if (emoji.name === this.client.config.emojis.default.loudspeaker) {
                msg.channel.getMessage(msg.id).then(m => { this.client.components.Guild.messageAllGuilds(m, true, 'notifications') })
            } else if (emoji.name == this.client.config.emojis.default.feeds) {
                msg.channel.getMessage(msg.id).then(m => { this.client.components.Guild.messageAllGuilds(m, false, 'feeds') })
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
    }
    guildMemberAdd(guild, member){
        if (guild.id !== this.client.config.guildID) { return };
        if (this.client.config.switches.welcome) {
            const mentionAdmin = Guild.getRole(guild, this.client.config.roles.admin);
            if (mentionAdmin) {
                // this.createMessage(guild.id, this.replace.do('roshanguild.welcomenewmember', { member: member.mention }, true));
            }
        }
        this.client.logger.info(`Member in: **${member.username}**`)
    }
    guildMemberRemove(guild, member){
        if (guild.id !== this.client.config.guildID) { return }
        this.client.logger.info(`Member out: **${member.username}**`)
    }
}

function ndToVoidString(text, int) { return text === 'ND' ? '' : int ? parseInt(text) : text }