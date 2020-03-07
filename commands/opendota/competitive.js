const { Classes, Markdown } = require('erisjs-utils')

module.exports = {
  name: ['competitive','comp'],
  category: 'Dota 2',
  help: 'Últimos resultados de partidas competitivas',
  args: '',
  run: async function (msg, args, client, command){
    msg.channel.sendTyping()
    return client.components.Opendota.competitive()
      .then(results => {
        const spacesBoard = ['19f', '2f', '19f', '17f', '11f']
        let table = Classes.Table.renderRow([msg.author.locale('dota2.radiant'), msg.author.locale('dota2.w'), msg.author.locale('dota2.dire'), msg.author.locale('dota2.league'), msg.author.locale('dota2.matchid')], spacesBoard, '\u2002') + '\n';
        results[0].slice(0,8).forEach(match => {
          const victory = match.radiant_win ? '>>' : '<<'
          table += Classes.Table.renderRow([client.components.Bot.parseText(match.radiant_name, 'nf'), victory, client.components.Bot.parseText(match.dire_name, 'nf'), client.components.Bot.parseText(match.league_name, 'nf')], spacesBoard, '\u2002') + ' ' + Markdown.link('https://www.dotabuff.com/matches/' + match.match_id, match.match_id) + '\n';    
        })
        return msg.reply({
          embed: {
            title: 'competitive.title',
            description: '<_matches_table>'
          }
        }, {
          _matches_table: table
        })
      }).catch(err => { msg.reply('error.opendotarequest') })
  }
}
