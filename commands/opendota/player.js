const odutil = require('../../helpers/opendota-utils')
const enumHeroes = require('../../enums/heroes')
const enumMedal = require('../../enums/medals')

module.exports = {
  name: ['player','p'],
  category : 'Dota 2',
  help : 'Información sobre un/a jugador/a',
  args : '[mención/dotaID/pro]',
  requirements: ["is.dota.player"],
  run: async function(msg, args, client, command){
    msg.channel.sendTyping()
    const [player, results] = await Promise.all([
      args.profile,
      client.components.Opendota.player(args.profile.data.dota)
    ])
    const profile = player.data
    const top5Heroes = results[2].slice(0,5).reduce((sum, el) => {
      return sum
        + msg.author.locale('top5Heroes', { hero: enumHeroes.getValue(el.hero_id).localized_name, wr: odutil.winratio(el.win, el.games - el.win), games: el.games }) + '\n'
    },'')
    const kda = odutil.kda(results[3][0].sum, results[3][1].sum, results[3][2].sum)
    const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
    return msg.reply({
      embed: {
        title: 'player.playerinfo',
        description: '<_sociallinks>',
        fields: [
          {name: 'player.wlr', value : '<_wlr>', inline: true},
          {name: 'player.kda', value : '<_kda>', inline: true},
          {name: 'player.top5heroes', value : '<_top5heroes>', inline: true},
        ],
        thumbnail: { url: '<_player_avatar>' },
        footer: { text: 'opendota.notenoprivateinfo', icon_url: '<bot_avatar>'}
      }
    }, {
      user: odutil.nameAndNick(results[0].profile),
      flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
      medal: client.components.Locale.replacer(medal.emoji),
      supporter: client.components.Locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
      _sociallinks: client.components.Account.socialLinks(profile),
      _player_avatar: results[0].profile.avatarmedium,
      _wlr: results[1].win + '/' + results[1].lose + ' (' + odutil.winratio(results[1].win, results[1].lose) + '%)',
      _kda: results[3][0].sum + '/' + results[3][1].sum + '/' + results[3][2].sum + ' (' + kda + ')',
      _top5heroes: top5Heroes
    })
  }
}
