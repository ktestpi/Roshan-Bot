const { Command } = require('aghanim')
const { Markdown } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const basic = require('../../helpers/basic')

module.exports = new Command('steam',{
  category : 'Dota 2', help : 'Url de steam de un jugador', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    msg.channel.sendTyping()
    return this.od.userID(msg, args)
      .then(player => Promise.all([player, this.od.player_steam(player.data.profile.dota)]))
      .then(data => {
        const [player, results] = data
        const lang = this.locale.getUserStrings(msg)
        return msg.reply({
          embed: {
            title: odutil.titlePlayer(results, lang.playerProfile, this.locale),
            description: this.locale.replacer(lang.steamProfileDesc, { profile: odutil.nameAndNick(results[0].profile), link: Markdown.link(results[0].profile.profileurl, lang.steam), url: results[0].profile.profileurl }),
            thumbnail: { url: results[0].profile.avatarmedium, height: 40, width: 40 },
            footer: { text: player.discordID ? msg.author.username : odutil.nameAndNick(results[0].profile), icon_url: player.discordID ? msg.author.avatarURL : results[0].profile.avatarmedium },
            color: this.config.color
          }
        })
      }).catch(err => this.od.error(msg, err))
  })
