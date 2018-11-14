const CustomPlugin = require('../classes/custom-plugin.js')
const odutil = require('../helpers/opendota-utils')
const { Datee, Markdown } = require('erisjs-utils')
const { UserError, ConsoleError } = require('../classes/errormanager.js')

module.exports = class Account extends CustomPlugin() {
	constructor(client, options) {
		super(client)
	}
	ready(){
	}
	schema(){
		return {
			lang: 'en',
				card : {
					bg: '0',
					heroes : 'all',
					pos : ''
			},
			dota : '',
			steam : ''
		}
	}
	get(discordID){
		return Promise.resolve(this.client.cache.profiles.get(discordID))
	}
	exists(discordID){
		return this.get(discordID).then((account) => {
			if (!account) { throw new UserError('account', 'needRegister')}
			return Promise.resolve(account)
		}).catch(err => Promise.reject(err))
	}
	existsAny(msg){
		return new Promise((res,rej) => {
			const discordID = msg.mentions.length ? msg.mentions[0].id : msg.author.id
			this.get(discordID).then((account) => {
				if( !account ){
					if (discordID === msg.author.id) { throw new UserError('account', 'needRegister')}
					else { throw new UserError('opendota', 'needRegisterMentioned', { username: msg.channel.guild.members.get(msg.mentions[0].id).username })}
				}
				res(account)
			}).catch(err => rej(err))
		})
	}
	create(discordID,dotaID,steamID,odResponse){
		const data = this.schema()
		data.dota = dotaID
		data.steam = steamID || data.steam
		return this.client.cache.profiles.save(discordID, data)
			.then(() => this.updateAccountLeaderboard(discordID, data.dota,odResponse))
			.then(() => this.client.notifier.console('userToLeaderboard', `${discordID}`))
	}
	modify(discordID,data){
		return this.client.cache.profiles.modify(discordID, data)
	}
	delete(discordID){
		return this.client.cache.profiles.erase(discordID)
			.then(() => this.deleteAccountLeaderboard(discordID))
			.then(() => this.client.notifier.console('userDelLeaderboard', `${discordID}`))
	}
	createProcess(discordID, dotaID, msg){
		const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM'
		const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id
		return this.client.plugins.Opendota.account(dotaID).then(([data]) => {
			if(!data.profile){return/*TODO error*/}
			const devLang = this.client.locale.getDevStrings()
			const lang = this.client.locale.getUserStrings(msg)
			return this.client.createMessage(this.client.config.guild.accounts,{
				embed :{
					title: this.client.locale.replacer(devLang.registerAccountTitle, { id: msg.author.id }),
					description: this.client.locale.replacer(devLang.registerAccountDesc, { guildName, guildID, dotaID: dotaID, steamID: data.profile.account_id}),
					//thumbnail : {url : config.icon, height : 40, width : 40},
					footer: { text: msg.author.username + ' | ' + msg.author.id + ' | ' + Datee.custom(msg.timestamp, 'D/M/Y h:m:s'), icon_url: msg.author.avatarURL },
					color: this.client.config.colors.account.register
			}}).then((m) => {
				msg.addReaction(this.client.config.emojis.default.envelopeIncoming)
				return this.create(discordID,dotaID,data.profile.steamid,data).then(() => {
					this.client.notifier.accountnew(`New account: **${msg.author.username}** (${msg.author.id})`)
					return msg.replyDM({
						embed: {
							title: this.client.locale.replacer(lang.welcomeToRoshan),
							//author : {name : config.bot.name, icon_url : config.bot.icon},
							description: this.client.locale.replacer(lang.infoAboutDotaForDiscord),
							fields: [{
								name: lang.dataUrRegistry,
								value: this.client.locale.replacer(lang.dataUrRegistryAccount, { dotaID: dotaID, steamID: data.profile.steamid }),
								inline: false
							}, {
								name: lang.tyForUrRegistry,
								value: this.client.locale.replacer(lang.helpRegistryDesc),
								inline: false
							}],
							thumbnail: { url: msg.author.avatarURL, height: 40, width: 40 },
							// footer : {text : lang.botCreated, icon_url : this.user.avatarURL},
							color: this.client.config.color
						}
					}).then(() => m.addReactionSuccess())
				})
			})
		})
	}
	deleteProcess(discordID, msg){
		const devLang = this.client.locale.getDevStrings()
		const lang = this.client.locale.getUserStrings(msg)
		const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM'
		const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id
		return this.client.createMessage(this.client.config.guild.accounts, {
			embed: {
				title: this.client.locale.replacer(devLang.unregisterAccountTitle, { id: msg.author.id }),
				description: this.client.locale.replacer(devLang.unregisterAccountDesc, { guildName, guildID }),
				//thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
				footer: { text: msg.author.username + ' | ' + msg.author.id + ' | ' + Datee.custom(msg.timestamp, 'D/M/Y h:m:s'), icon_url: msg.author.avatarURL },
				color: this.client.config.colors.account.delete
			}
		}).then((m) => {
			msg.addReaction(this.client.config.emojis.default.envelopeIncoming)
			return this.delete(discordID).then(() => {
				// TODO: Remove Leaderboard
				this.client.notifier.accountremove(`Account deleted: **${msg.author.username}** (${msg.author.id})`)
				return msg.reply(this.client.locale.replacer(lang.accountDeleted))
					.then(() => m.addReactionSucess())
			})
		})
	}
	updateAccountLeaderboard(discordID, dotaID, data) {
		if (data) {
			const player = this.client.users.get(discordID)
			const rank = odutil.getMedal(data, 'raw')
			const update = {
					username: player.username || data.profile.personaname,
					nick: data.profile.personaname || '',
					avatar: player.avatarURL || data.profile.avatarmedium,
					rank: rank.rank,
					leaderboard: rank.leaderboard
			}
			return Promise.all([
				this.client.db.child(`leaderboard/ranking/${discordID}`).update(update),
				this.updatePublicLeaderboardPlayers()
			])
		} else {
			return this.client.plugins.Opendota.account(dotaID).then(([data]) => this.updateAccountLeaderboard(discordID, dotaID, data))
		}
	}
	deleteAccountLeaderboard(discordID){
		return Promise.all([
			this.client.db.child(`leaderboard/ranking/${discordID}`).remove(),
			this.updatePublicLeaderboardPlayers()
		])
	}
	updatePublicLeaderboardPlayers(){
		return this.client.db.child('public').update({users : this.client.cache.profiles.size})
	}
	socialLink(tag, id, show) {
		let link
		if (tag === 'dota') {
			link = `https://www.dotabuff.com/players/${id}`
		} else {
			link = `http://www.steamcommunity.com/id/${id}`
		}
		return Markdown.link(link, tag, show)
	}
	socialLinks(account, mode = 'inline', show = 'embed') {
		const links = [
			this.socialLink('dota', account.dota, show),
			this.socialLink('steam', account.steam, show)
		]
		if (mode == 'inline') {
			return links.join(' / ')
		} else if (mode == 'vertical') {
			return links.join('\n')
		}
	}
}
