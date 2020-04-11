const { Component, Eris } = require('aghanim')
const CustomComponent = require('../classes/custom-component')
const { Datee, Member } = require('erisjs-utils')
const util = require('erisjs-utils')
const enumFeeds = require('../enums/feeds')

module.exports = class Guild extends CustomComponent() {
    constructor(client, options) {
        super(client)
        Object.defineProperty(Eris.Guild.prototype, 'account', {
            get: function () {
                return client.cache.servers.get(this.id) || client.components.Account.schema()
            }
        })

        Object.defineProperty(Eris.Guild.prototype, 'registered', {
            get: function () {
                return client.cache.servers.has(this.id)
            },
            enumerable: true
        })
    }
    ready(){
        this.waitOnce('cache:init', () => {
            this.client.guilds.forEach(guild => {
                this.get(guild.id).then(data => {
                    if(!data){
                        this.createProcess(guild).then(() => {
                            this.client.logger.info(`**${guild.name}** servidor encontrado. Registrado en el bot.`)
                        })
                    } 
                })
            })
        })
    }
    messageCreate(msg) {
        if (this.client.config.guild.feedsHidden === msg.channel.id
            && this.client.config.switches.feeds
            && this.client.config.webhooks.feedsHidden === msg.author.id) { // AutoFeeds
                this.messageAllGuilds(msg, false, 'feeds')
                msg.addReaction(this.client.config.emojis.default.feeds)
        }
    }
    guildCreate(guild) {
        return this.createProcess(guild)
    }
    messageReactionAdd(msg, emoji, userID) {
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
    schema(){
        return {
            notifications: { channel: '', enable: true },
            feeds: { channel: '', enable: true, subs: '' },
            lang: ''
        }
    }
    get(guildID){
        return Promise.resolve(this.client.cache.servers.get(guildID))
    }
    create(guildID){
        const schema = this.schema()
        const defaultChannel = util.Guild.getDefaultChannel(this.client.guilds.get(guildID), this.client, true).id
        schema.notifications.channel = defaultChannel
        schema.feeds.channel = defaultChannel
        schema.lang = this.client.components.Locale.defaultLanguage
        return this.client.cache.servers.save(guildID,schema)
    }
    modify(guildID,data){
        return this.client.cache.servers.save(guildID,data)
    }
    delete(guildID){
        return this.client.cache.servers.remove(guildID)
    }
    createProcess(guild){
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
        return this.create(guild.id).then(() => {
            this.client.logger.info(`New guild: **${guild.name}**`)
            const defaultChannel = util.Guild.getDefaultChannel(guild, this.client, true)
            if (defaultChannel) {
                defaultChannel.createMessage(
                    this.client.components.Locale.replacer(`Hi, I am a **Dota 2** and **Artifact** bot. Read the **server guide**: use \`r!getstarted\`. Bot features at <link_web_features>`)
                )
            }
        })
        
    }
    deleteProcess(guild){
        return this.delete(guild.id).then(() => {
            this.client.guild.info(`Remove guild: **${guild.name}**`)
        })
    }
    messageAllGuilds(msg, all, mode) {
        if (!this.client.config.switches.msgGuilds) { return }
        const message = mode !== 'feeds' ? msg.content : `${this.client.config.emojis.default.feeds} **${msg.author.username}**: ${msg.content}`;
        const author = enumFeeds.getKey(msg.author.username);
        const servers = this.client.guilds.map(g => g)//this.cache.servers.getall()
        if (!servers) { return };
        if (msg.attachments.length < 1) {
            servers.forEach(server => {
                const cached = this.client.cache.servers.get(server.id)
                if (!cached) { return this.createProcess(server).then(() => this.client.logger.info(`New guild: **${server.name}**`)).catch(err => this.client.logger.error(`Error creating config for **${server.name}** (${server.id})`)) }
                if (!all && cached && !cached[mode].enable) { return };
                const channel = cached ? cached[mode].channel : util.Guild.getDefaultChannel(server, this.client, true).id
                if (mode === 'feeds' && !cached.feeds.subs.split(',').includes(author)) { return }
                
                this.client.createMessage(channel, { content: message, embed: msg.embeds.length > 0 ? msg.embeds[0] : {}, disableEveryone: false }).catch(err => {
                    // Create the message to defaultChannel of guild (not cofigurated)
                    // this.createMessage(util.Guild.getDefaultChannel(server,this,true).id,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false})
                    this.client.logger.info(`Guildmessage: Error al enviar un mensaje a la guild\n**${server.name}** (${server.id}) [#${channel}]`)
                })
            })
        } else {
            Message.sendImage(msg.attachments[0].url).then(buffer => {
                servers.forEach(server => {
                    const cached = this.client.cache.servers.get(server.id)
                    if (!cached) { return this.createProcess(server).then(() => this.client.logger.info(`New guild: **${server.name}**`)).catch(err => this.client.logger.error(`Error creating config for **${server.name}** (${server.id})`)) }
                    if (!all && cached && !cached[mode].enable) { return };
                    const channel = cached ? cached[mode].channel : util.Guild.getDefaultChannel(server, this.client, true).id
                    if (mode === 'feeds' && !cached.feeds.subs.split(',').includes(author)) { return }
                    this.client.createMessage(channel, { content: message, embed: msg.embeds.length > 0 ? msg.embeds[0] : {}, disableEveryone: false }, { file: results, name: msg.attachments[0].filename }).catch(err => {
                        // Create the message to defaultChannel of guild (not cofigurated)
                        // this.createMessage(Guild.getDefaultChannel(server,this,true).id,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false},{file : results, name : msg.attachments[0].filename})
                        this.client.logger.error(`Error al enviar un mensaje a la guild\n**${server.name}** (${server.id}) [#${channel}]`)
                    })
                })
            })
        }
        // if(!notAll){config.logger.add(mode,message,true)}else{config.logger.add('shout',message,true);}
    }
}
