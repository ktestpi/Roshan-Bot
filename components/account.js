const CustomComponent = require('../classes/custom-component.js')
const { Eris } = require('aghanim')
const odutil = require('../helpers/opendota-utils')
const { Datee, Markdown } = require('erisjs-utils')

module.exports = class Account extends CustomComponent() {
	constructor(client, options) {
		super(client)
		Object.defineProperty(Eris.User.prototype, 'account', {
			get: function () {
				return client.cache.profiles.get(this.id) || client.components.Account.schema()
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

		// Define custom requirements
		this.client.addCommandRequirement({
			type: 'account.exist',
			validate: async (msg, args, client, command, req) => {
			  const account = await client.components.Account.get(msg.author.id)
			  if(!account){return false}
			  args.account = account
			  return true
			},
			response: (msg, args, client, command, req) => msg.author.locale("bot.needregister")
		  })

		this.client.addCommandRequirement({
			type: 'account.existany',
			validate: async (msg, args, client, command, req) => {
				args.user = msg.mentions.length ? msg.mentions[0] : msg.author
				args.account = await client.components.Account.get(args.user.id)
				if(!args.account){	
					if (args.user.id === msg.author.id) {
						await msg.reply("bot.needregister")
						return null
					}
					return false
				}
				return true
			},
			response: "Your account doesn't exist"
		})

		this.client.addCommandRequirement({
			type: 'account.registered',
			validate: async (msg, args, client, command, req) => {
				return msg.author.registered
			},
			response: (msg, args, client, command, req) => msg.author.locale('bot.needregister')
		})
		this.client.addCommandRequirement({
			type: 'account.supporter',
			validate: async (msg, args, client, command, req) => {
				return msg.author.supporter
			},
			response: (msg, args, client, command, req) => msg.author.locale('roshan.supporter.need')
		})
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
	create(discordID,dotaID,steamID,odResponse){
		const data = this.schema()
		data.dota = dotaID
		data.steam = steamID || data.steam
		return this.client.cache.profiles.save(discordID, data)
			.then(() => this.updateAccountLeaderboard(discordID, data.dota,odResponse))
			.then(() => this.client.logger.info('userToLeaderboard: ' + `${discordID}`))
	}
	modify(discordID,data){
		return this.client.cache.profiles.save(discordID, data)
	}
	delete(discordID){
		return this.client.cache.profiles.remove(discordID)
			.then(() => this.deleteAccountLeaderboard(discordID))
			.then(() => this.client.logger.info('userDelLeaderboard: ' + `${discordID}`))
	}
	createProcess(discordID, dotaID, msg){
		const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM'
		const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id
		return this.client.components.Opendota.account(dotaID).then(([data]) => {
			if(!data.profile){throw new Error('Profile not found')}
			return this.client.createMessage(this.client.config.guild.accounts,{
				embed :{
					title: this.client.components.Locale.replacer('registerAccountTitle', { id: msg.author.id }),
					description: this.client.components.Locale.replacer('registerAccountDesc', { guildName, guildID, dotaID: dotaID, steamID: data.profile.steamid}),
					//thumbnail : {url : config.icon, height : 40, width : 40},
					footer: { text: msg.author.username + ' | ' + msg.author.id + ' | ' + Datee.custom(msg.timestamp, 'D/M/Y h:m:s'), icon_url: msg.author.avatarURL },
					color: this.client.config.colors.account.register
			}}).then((m) => {
				msg.addReaction(this.client.config.emojis.default.envelopeIncoming)
				return this.create(discordID,dotaID,data.profile.steamid,data).then(() => {
					this.client.logger.info(`New account: **${msg.author.username}** (${msg.author.id})`)
					return msg.replyDM({
						embed: {
							title: 'roshan.welcometo',
							description: 'roshan.infoabout',
							fields: [
								{ name: 'register.dataurregistry', value: 'register.dataurregistryaccount', inline: false},
								{ name: 'register.tyforurregistry', value: 'register.helpregistrydesc', inline: false}
							],
							thumbnail: { url: '<_user_avatar>' }
						}
					}, { dotaID: dotaID, steamID: data.profile.steamid, _user_avatar: msg.author.avatarURL})
						.then(() => m.addReactionSuccess())
				})
			})
		})
	}
	deleteProcess(discordID, msg){
		const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM'
		const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id
		return this.client.createMessage(this.client.config.guild.accounts, {
			embed: {
				title: this.client.components.Locale.replacer('unregisterAccountTitle', { id: msg.author.id }),
				description: this.client.components.Locale.replacer('unregisterAccountDesc', { guildName, guildID }),
				//thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
				footer: { text: msg.author.username + ' | ' + msg.author.id + ' | ' + Datee.custom(msg.timestamp, 'D/M/Y h:m:s'), icon_url: msg.author.avatarURL },
				color: this.client.config.colors.account.delete
			}
		}).then((m) => {
			msg.addReaction(this.client.config.emojis.default.envelopeIncoming)
			return this.delete(discordID).then(() => {
				// TODO: Remove Leaderboard
				this.client.logger.info(`Account deleted: **${msg.author.username}** (${msg.author.id})`)
				return msg.reply('account.deleted')
					.then(() => m.addReactionSuccess())
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
			return this.client.components.Opendota.account(dotaID).then(([data]) => this.updateAccountLeaderboard(discordID, dotaID, data))
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
			link = `http://www.steamcommunity.com/profiles/${id}`
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
