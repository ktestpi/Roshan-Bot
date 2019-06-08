const { Command } = require('aghanim')
const odutil = require('../../helpers/opendota-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const enumMedal = require('../../enums/medals')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'player.playerinfo',
  description: '<_sociallinks>',
  fields: [
    {name: 'player.wlr', value : '<_wlr>', inline: true},
    {name: 'player.kda', value : '<_kda>', inline: true},
    {name: 'player.top5heroes', value : '<_top5heroes>', inline: true},
  ],
  thumbnail: { url: '<_player_avatar>' },
  footer: { text: 'opendota.notenoprivateinfo', icon_url: '<bot_avatar>'}
})

module.exports = new Command(['player','p'],{
  category : 'Dota 2', help : 'Información sobre un/a jugador/a', args : '[mención/dotaID/pro]'},
  async function(msg, args, client){
    msg.channel.sendTyping()
    return client.components.Opendota.userID(msg, args)
      // .then(player => Promise.all([player,client.components.Opendota.player(player.data.profile.dota)]))
      .then(player => Promise.all([
          player,
          client.components.Opendota.player(player.data.dota)
            .catch(err => { throw new UserError('opendota', 'error.opendotarequest', err)})
          ]
        )
      )
      .then(data => {
        const [player, results] = data
        const profile = player.data
        const top5Heroes = results[2].slice(0,5).reduce((sum, el) => {
          return sum
            + args.user.locale('top5Heroes', { hero: enumHeroes.getValue(el.hero_id).localized_name, wr: odutil.winratio(el.win, el.games - el.win), games: el.games }) + '\n'
        },'')
        const kda = odutil.kda(results[3][0].sum, results[3][1].sum, results[3][2].sum)
        const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
        return msg.reply(embed, {
          user: odutil.nameAndNick(results[0].profile),
          flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
          medal: client.locale.replacer(medal.emoji),
          supporter: client.locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
          _sociallinks: client.components.Account.socialLinks(profile),
          _player_avatar: results[0].profile.avatarmedium,
          _wlr: results[1].win + '/' + results[1].lose + ' (' + odutil.winratio(results[1].win, results[1].lose) + '%)',
          _kda: results[3][0].sum + '/' + results[3][1].sum + '/' + results[3][2].sum + ' (' + kda + ')',
          _top5heroes: top5Heroes
        })
        // return msg.reply({
        //   embed: {
        //     title: odutil.titlePlayer(results, args.user.langstring('playerProfile'), client, player.profile),
        //     description: client.components.Account.socialLinks(profile),
        //     fields: [
        //       {
        //         name: args.user.langstring('wlr'),
        //         value: results[1].win + '/' + results[1].lose + ' (' + odutil.winratio(results[1].win, results[1].lose) + '%)',
        //         inline: true
        //       },
        //       {
        //         name: args.user.langstring('KDA'),
        //         value: results[3][0].sum + '/' + results[3][1].sum + '/' + results[3][2].sum + ' (' + kda + ')',
        //         inline: false
        //       },
        //       {
        //         name: args.user.langstring('top5HeroesTitle'),
        //         value: top5Heroes,
        //         inline: true
        //       }
        //     ],
        //     thumbnail: { url: results[0].profile.avatarmedium, height: 40, width: 40 },
        //     footer: { text: args.user.langstring('noteData'), icon_url: client.user.avatarURL },
        //     color: client.config.color
        //   }
        // })
      })
  })
