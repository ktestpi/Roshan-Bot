const { Command } = require('aghanim')
const odutil = require('../../helpers/opendota-utils')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
const enumMedal = require('../../enums/medals')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'withpros.playerinfo',
  description: '<_description>',
  thumbnail: {url: '<_player_avatar>'},
  footer: { text: 'withpros.footer', icon_url: '<bot_avatar>' }
})

module.exports = new Command('withpros',{
  category : 'Dota 2', help : 'Pros con los que has jugado', args : '[mención/dotaID/pro]'},
  async function(msg, args, client){
    msg.channel.sendTyping()
    return client.components.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        client.components.Opendota.player_pros(player.data.dota)
          .catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
      ]))
      .then(data => {
        const [player, results] = data
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
        description = description || args.user.langstring('withpros.withno')
        const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
        return msg.reply(embed, {
          user: odutil.nameAndNick(results[0].profile),
          flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
          medal: client.locale.replacer(medal.emoji),
          supporter: client.locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
          _description: description,
          _player_avatar: results[0].profile.avatarmedium,
          number: resultsShow !== resultsTotal ? resultsShow + "/" + resultsTotal : results[1].length
        })
        // return msg.reply({
        //   embed: {
        //     title: odutil.titlePlayer(results, args.user.langstring('playerProfile'), client, player.profile),
        //     description: description,
        //     thumbnail: { url: results[0].profile.avatarmedium, height: 40, width: 40 },
        //     footer: { text: args.user.locale('withProsFooter', { number: resultsShow !== resultsTotal ? resultsShow + "/" + resultsTotal : results[1].length }), icon_url: client.user.avatarURL },
        //     color: client.config.color
        //   }
        // })
      })
  })
