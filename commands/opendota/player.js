const { Command } = require('aghanim')
const odutil = require('../../helpers/opendota-utils')
const basic = require('../../helpers/basic')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command(['player','p'],{
  category : 'Dota 2', help : 'Información sobre un/a jugador/a', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    msg.channel.sendTyping()
    return this.plugins.Opendota.userID(msg, args)
      // .then(player => Promise.all([player,this.plugins.Opendota.player(player.data.profile.dota)]))
      .then(player => Promise.all([
          player,
          this.plugins.Opendota.player(player.data.profile.dota)
            .catch(err => {throw new UserError('opendota', 'errorOpendotaRequest', err)})
          ]
        )
      )
      .then(data => {
        const [player, results] = data
        const profile = player.data
        profile.profile.steam = basic.parseProfileURL(results[0].profile.profileurl, 'steam')
        const lang = this.locale.getUserStrings(msg)
        const top5Heroes = results[2].slice(0,5).reduce((sum, el) => {
          return sum
            + this.locale.replacer(lang.top5Heroes, { hero: enumHeroes.getValue(el.hero_id).name, wr: odutil.winratio(el.win, el.games - el.win), games: el.games }) + '\n'
        },'')
        const kda = odutil.kda(results[3][0].sum, results[3][1].sum, results[3][2].sum)
        return msg.reply({
          embed: {
            title: odutil.titlePlayer(results, lang.playerProfile, this.locale),
            description: basic.socialLinks(profile.profile, 'inline', this.config.links.profile) || '',
            fields: [
              {
                name: lang.wlr,
                value: results[1].win + '/' + results[1].lose + ' (' + odutil.winratio(results[1].win, results[1].lose) + '%)',
                inline: true
              },
              {
                name: lang.KDA,
                value: results[3][0].sum + '/' + results[3][1].sum + '/' + results[3][2].sum + ' (' + kda + ')',
                inline: false
              },
              {
                name: lang.top5HeroesTitle,
                value: top5Heroes,
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
