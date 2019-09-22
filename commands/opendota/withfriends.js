const { Command } = require('aghanim')
const { Classes } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const enumMedal = require('../../enums/medals')

module.exports = new Command(['withfriends','friends'],{
  category : 'Dota 2', help : 'Estadísticas de partidas jugadas con amig@s', args : '[mención/dotaID/pro]'},
  async function(msg, args, client, command){
    msg.channel.sendTyping()
    return client.components.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        client.components.Opendota.player_friends(player.data.dota)
          .catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
      ]))
      .then(data => {
        const [player, results] = data
        const profile = player.data
        results[1] = results[1].filter(friend => friend.with_games > 0)
        const spacesBoard = ['25f', '3cf', '6cf'];
        let table = Classes.Table.renderRow([client.components.Bot.parseText(msg.author.locale('player'), 'nf'), msg.author.locale('games').slice(0, 1), msg.author.locale('gamesWR')], spacesBoard, '\u2002') + '\n';
        if (results[1].length > 0) {
          results[1].forEach(friend => {
            if (table.length > client.config.constants.descriptionChars) { return }
            table += Classes.Table.renderRow([friend.personaname, friend.with_games, odutil.winratio(friend.with_win, friend.with_games - friend.with_win) + '%'], spacesBoard, '\u2002') + '\n';
          })
        }
        const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
        return msg.reply({
          embed: {
            title: 'withfriends.playerinfo',
            description: '<_description>',
            thumbnail: {url: '<_player_avatar>'},
            footer: { text: 'withfriends.footer', icon_url: '<bot_avatar>' }
          }
        }, {
          user: odutil.nameAndNick(results[0].profile),
          flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
          medal: client.components.Locale.replacer(medal.emoji),
          supporter: client.components.Locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
          _description: results[1].length > 0 ? table : msg.author.locale('withfriends.withno'),
          _player_avatar: results[0].profile.avatarmedium,
          number: results[1].length > 0 ? results[1].length : '0'
        })
      })
  })
