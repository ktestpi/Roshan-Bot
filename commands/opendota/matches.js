const { Command } = require('aghanim')
const odutil = require('../../helpers/opendota-utils')
const basic = require('../../helpers/basic')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('matches',{
  category : 'Dota 2', help : 'Últimas partidas jugadas', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    msg.channel.sendTyping()
    return this.plugins.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        this.plugins.Opendota.player_matches(player.data.profile.dota)
          .catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err) })
      ]))
      .then(data => {
        const [player, results] = data
        const profile = player.data
        profile.profile.steam = basic.parseProfileURL(results[0].profile.profileurl, 'steam')
        const lang = this.locale.getUserStrings(msg)
        const spacesBoard = ['1f', '19f', '8f', '8f', '12f'];
        let table = util.Classes.Table.renderRow([lang.wl, lang.hero, lang.kda, lang.duration.slice(0, 3), lang.matchID], spacesBoard, '\u2002') + '\n';
        results[1].slice(0,8).forEach(match => {
          if (!match) { return };
          table += util.Classes.Table.renderRow([odutil.winOrLose(match.radiant_win, match.player_slot).slice(0, 1), enumHeroes.getValue(match.hero_id).name, match.kills + '/' + match.deaths + '/' + match.assists, basic.durationTime(match.duration)], spacesBoard, '\u2002')
            + '    ' + util.Markdown.link('https://www.dotabuff.com/matches/' + match.match_id, match.match_id) + '\n';
        })
        return msg.reply({
          embed: {
            title: odutil.titlePlayer(results, lang.playerProfile, this.locale),
            description: basic.socialLinks(profile.profile, 'inline', this.config.links.profile) || '',
            fields: [
              {
                name: lang.recentMatches + ' > ' + util.Date.custom(results[1][0].start_time * 1000, '[D/M/Y h:m:s]'),
                value: table,
                inline: true
              }
            ],
            thumbnail: { url: results[0].profile.avatarmedium, height: 40, width: 40 },
            footer: { text: lang.noteData, icon_url: this.user.avatarURL },
            color: this.config.color
          }
        })
      })
  })
