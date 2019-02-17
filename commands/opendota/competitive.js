const { Command } = require('aghanim')
const { Classes, Markdown } = require('erisjs-utils')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'competitive.title',
  description: '<_matches_table>'
})

module.exports = new Command(['competitive','comp'],{
  category : 'Dota 2', help : 'Últimos resultados de partidas competitivas', args : ''},
  async function(msg, args, client){
    msg.channel.sendTyping()
    return client.components.Opendota.competitive()
      .then(results => {
        const spacesBoard = ['19f', '2f', '19f', '17f', '11f']
        let table = Classes.Table.renderRow([args.user.langstring('dota2.radiant'), args.user.langstring('dota2.w'), args.user.langstring('dire'), args.user.langstring('dota2.league'), args.user.langstring('dota2.matchID')], spacesBoard, '\u2002') + '\n';
        results[0].slice(0,8).forEach(match => {
          const victory = match.radiant_win ? '>>' : '<<'
          table += Classes.Table.renderRow([client.components.Bot.parseText(match.radiant_name, 'nf'), victory, client.components.Bot.parseText(match.dire_name, 'nf'), client.components.Bot.parseText(match.league_name, 'nf')], spacesBoard, '\u2002') + ' ' + Markdown.link('https://www.dotabuff.com/matches/' + match.match_id, match.match_id) + '\n';    
        })
        return msg.reply(embed, {
          _matches_table: table
        })
      }).catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
  })
