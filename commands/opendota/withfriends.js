const { Command } = require('aghanim')
const { Classes } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const basic = require('../../helpers/basic')

module.exports = new Command(['withfriends','friends'],{
  category : 'Dota 2', help : 'Estadísticas de partidas jugadas con amig@s', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    msg.channel.sendTyping()
    return this.plugins.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        this.plugins.Opendota.player_friends(player.data.profile.dota)
          .catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err) })
      ]))
      .then(data => {
        const [player, results] = data
        const profile = player.data
        const lang = this.locale.getUserStrings(msg)
        profile.profile.steam = basic.parseProfileURL(results[0].profile.profileurl, 'steam')
        results[1] = results[1].filter(friend => friend.with_games > 0)
        const spacesBoard = ['25f', '3cf', '6cf'];
        let table = Classes.Table.renderRow([basic.parseText(lang.player, 'nf'), lang.games.slice(0, 1), lang.gamesWR], spacesBoard, '\u2002') + '\n';
        if (results[1].length > 0) {
          results[1].forEach(friend => {
            if (table.length > this.config.constants.descriptionChars) { return }
            table += Classes.Table.renderRow([friend.personaname, friend.with_games, odutil.winratio(friend.with_win, friend.with_games - friend.with_win) + '%'], spacesBoard, '\u2002') + '\n';
          })
        }
        return msg.reply({
          embed: {
            title: odutil.titlePlayer(results, lang.playerProfile, this.locale),
            description: results[1].length > 0 ? table : lang.withFriendsNo,
            thumbnail: { url: results[0].profile.avatarmedium, height: 40, width: 40 },
            footer: { text: this.locale.replacer(lang.withFriendsFooter, { number: results[1].length > 0 ? results[1].length : '0' }), icon_url: this.user.avatarURL },
            color: this.config.color
          }
        })
      }).catch(err => this.plugins.Opendota.error(msg, err))
  })
