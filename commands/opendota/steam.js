const { Command } = require('aghanim')
const { Markdown } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const EmbedBuilder = require('../../classes/embed-builder.js')
const enumMedal = require('../../enums/medals')
const embed = new EmbedBuilder({
  title: 'steam.playerinfo',
  description: 'steam.description',
  // footer: { text: 'searchpro.footer', icon_url: '<bot_avatar>' }
})

module.exports = new Command('steam',{
  category : 'Dota 2', help : 'Url de steam de un jugador', args : '[mención/dotaID/pro]'},
  async function(msg, args, client){
    msg.channel.sendTyping()
    return client.components.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        client.components.Opendota.player_steam(player.data.dota)
          .catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
      ]))
      .then(data => {
        const [player, results] = data
        const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
        return msg.reply(embed, {
          user: odutil.nameAndNick(results[0].profile),
          flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
          medal: client.locale.replacer(medal.emoji),
          supporter: client.locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
          profile: odutil.nameAndNick(results[0].profile),
          link: Markdown.link(results[0].profile.profileurl, args.user.langstring('global.steam')),
          url: results[0].profile.profileurl 
        })
        // return msg.reply({
        //   embed: {
        //     title: odutil.titlePlayer(results, args.user.langstring('playerProfile'), client, player.profile),
        //     description: args.user.locale('steamProfileDesc', { profile: odutil.nameAndNick(results[0].profile), link: Markdown.link(results[0].profile.profileurl, args.user.langstring('steam')), url: results[0].profile.profileurl }),
        //     thumbnail: { url: results[0].profile.avatarmedium, height: 40, width: 40 },
        //     footer: { text: player.discordID ? msg.author.username : odutil.nameAndNick(results[0].profile), icon_url: player.discordID ? msg.author.avatarURL : results[0].profile.avatarmedium },
        //     color: client.config.color
        //   }
        // })
      })
  })
