const { Command } = require('aghanim')
const { Classes, Markdown } = require('erisjs-utils')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command(['competitive','comp'],{
  category : 'Dota 2', help : 'Últimos resultados de partidas competitivas', args : ''},
  function(msg, args, command){
    msg.channel.sendTyping()
    return this.plugins.Opendota.competitive()
      .then(results => {
        const spacesBoard = ['19f', '2f', '19f', '17f', '11f'];
        const lang = this.locale.getUserStrings(msg)
        let table = Classes.Table.renderRow([lang.radiant, lang.w, lang.dire, lang.league, lang.matchID], spacesBoard, '\u2002') + '\n';
        results[0].slice(0,8).forEach(match => {
          const victory = match.radiant_win ? '>>' : '<<'
          table += Classes.Table.renderRow([this.plugins.Bot.parseText(match.radiant_name, 'nf'), victory, this.plugins.Bot.parseText(match.dire_name, 'nf'), this.plugins.Bot.parseText(match.league_name, 'nf')], spacesBoard, '\u2002') + ' ' + Markdown.link('https://www.dotabuff.com/matches/' + match.match_id, match.match_id) + '\n';    
        })
        return msg.reply({
          embed: {
            title: lang.lastProMatchesTitle,
            description: table,
            color: this.config.color
          }
        })
      }).catch(err => {throw new UserError('opendota', 'errorOpendotaRequest', err) })
  })
