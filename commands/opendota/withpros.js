const odutil = require('../../helpers/opendota-utils')
const enumMedal = require('../../enums/medals')

module.exports = {
  name: 'withpros',
  category: 'Dota 2',
  help: 'Pros con los que has jugado',
  args: '[mención/dotaID/pro]',
  requirements: ["is.dota.player"],
  run: async function(msg, args, client, command){
    msg.channel.sendTyping()
    const [ player, results ] = await Promise.all([
      args.profile,
      client.components.Opendota.player_pros(args.profile.data.dota)
    ])
    const profile = player.data
    const resultsTotal = results[1].length;
    results[1].sort(function () { return .5 - Math.random() });
    let resultsShow = 0;
    let description = '';
    results[1].forEach(pro => {
      if (description.length > client.config.constants.descriptionChars) { return }
      if (pro.team_tag != null) {
        description += '**' + client.components.Bot.parseText(pro.name, 'nf') + '** (' + client.components.Bot.parseText(pro.team_tag, 'nf') + '), ';
      } else { description += '**' + client.components.Bot.parseText(pro.name, 'nf') + '**, '; }
      resultsShow++
    })
    description = description.slice(0, -2)
    description = description || msg.author.locale('withpros.withno')
    const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
    return msg.reply({
      embed: {
        title: 'withpros.playerinfo',
        description: '<_description>',
        thumbnail: {url: '<_player_avatar>'},
        footer: { text: 'withpros.footer', icon_url: '<bot_avatar>' }
      }
    }, {
      user: odutil.nameAndNick(results[0].profile),
      flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
      medal: client.components.Locale.replacer(medal.emoji),
      supporter: client.components.Locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
      _description: description,
      _player_avatar: results[0].profile.avatarmedium,
      number: resultsShow !== resultsTotal ? resultsShow + "/" + resultsTotal : results[1].length
    })
  }
}
