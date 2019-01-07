const { Command } = require('aghanim')
const odutil = require('../../helpers/opendota-utils')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('withpros',{
  category : 'Dota 2', help : 'Pros con los que has jugado', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    msg.channel.sendTyping()
    return this.components.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        this.components.Opendota.player_pros(player.data.dota)
          .catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err) })
      ]))
      .then(data => {
        const [player, results] = data
        const profile = player.data
        const lang = this.locale.getUserStrings(msg)
        const resultsTotal = results[1].length;
        results[1].sort(function () { return .5 - Math.random() });
        let resultsShow = 0;
        let description = '';
        results[1].forEach(pro => {
          if (description.length > this.config.constants.descriptionChars) { return }
          if (pro.team_tag != null) {
            description += '**' + this.components.Bot.parseText(pro.name, 'nf') + '** (' + this.components.Bot.parseText(pro.team_tag, 'nf') + '), ';
          } else { description += '**' + this.components.Bot.parseText(pro.name, 'nf') + '**, '; }
          resultsShow++
        })
        description = description.slice(0, -2)
        description = description || lang.withProsNo
        
        return msg.reply({
          embed: {
            title: odutil.titlePlayer(results, lang.playerProfile, this.locale),
            description: description,
            thumbnail: { url: results[0].profile.avatarmedium, height: 40, width: 40 },
            footer: { text: this.locale.replacer(lang.withProsFooter, { number: resultsShow !== resultsTotal ? resultsShow + "/" + resultsTotal : results[1].length }), icon_url: this.user.avatarURL },
            color: this.config.color
          }
        })
      })
  })
