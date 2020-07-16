const odutil = require('../../helpers/opendota-utils')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const enumMedal = require('../../enums/medals')

module.exports = {
  name: ['matches','games'],
  category: 'Dota 2',
  help: 'Últimas partidas jugadas',
  args: '[mención/dotaID/pro]',
  requirements: [
    "is.dota.player"
  ],
  run: async function(msg, args, client, command){
    msg.channel.sendTyping()
    const [player, results] = await Promise.all([
      args.profile,
      client.components.Opendota.player_matches(args.profile.data.dota)
    ])
    const profile = player.data
    const spacesBoard = ['1f', '19f', '8f', '8f', '12f'];
    let table = util.Classes.Table.renderRow([msg.author.locale('dota2.wl'), msg.author.locale('dota2.hero'), msg.author.locale('dota2.kda'), msg.author.locale('dota2.duration').slice(0, 3), msg.author.locale('matchID')], spacesBoard, '\u2002') + '\n';
    results[1].slice(0,8).forEach(match => {
      if (!match) { return };
      table += util.Classes.Table.renderRow([odutil.winOrLose(match.radiant_win, match.player_slot).slice(0, 1), enumHeroes.getValue(match.hero_id).localized_name, match.kills + '/' + match.deaths + '/' + match.assists, odutil.durationTime(match.duration)], spacesBoard, '\u2002')
        + '    ' + util.Markdown.link('https://www.dotabuff.com/matches/' + match.match_id, match.match_id) + '\n';
    })
    const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
    return msg.reply({
      embed: {
        title: 'matches.playerinfo',
        description: '<_sociallinks>',
        fields: [
          {name: 'matches.last', value : '<_matches>', inline: false}
        ],
        thumbnail: { url: '<_player_avatar>'}
      }
    }, {
      user: odutil.nameAndNick(results[0].profile),
      flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
      medal: client.components.Locale.replacer(medal.emoji),
      supporter: client.components.Locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
      _sociallinks: client.components.Account.socialLinks(profile),
      match_date: util.Date.custom(results[1][0].start_time * 1000, '[D/M/Y h:m:s]'),
      _player_avatar: results[0].profile.avatarmedium,
      _matches: table
    })
  }
}
