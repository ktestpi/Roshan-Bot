const { Markdown } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const enumMedal = require('../../enums/medals')

module.exports = {
  name: 'steam',
  category: 'Dota 2',
  help: 'Url de steam de un jugador',
  args: '[mención/dotaID/pro]',
  requirements: ["is.dota.player"],
  run: async function(msg, args, client, command){
    msg.channel.sendTyping()
    const [ player, results ] = await Promise.all([
      args.profile,
      client.components.Opendota.player_steam(args.profile.data.dota)
    ])
    const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
    return msg.reply({
      embed: {
        title: 'steam.playerinfo',
        description: 'steam.description',
        // footer: { text: 'searchpro.footer', icon_url: '<bot_avatar>' }
      }
    }, {
      user: odutil.nameAndNick(results[0].profile),
      flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
      medal: client.components.Locale.replacer(medal.emoji),
      supporter: client.components.Locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
      profile: odutil.nameAndNick(results[0].profile),
      link: Markdown.link(results[0].profile.profileurl, msg.author.locale('global.steam')),
      url: results[0].profile.profileurl 
    })
  }
}
