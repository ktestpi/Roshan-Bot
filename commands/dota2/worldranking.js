const { Datee, Classes } = require('erisjs-utils')

module.exports = {
  name: 'worldranking',
  category : 'Dota 2',
  help : 'Clasificación mundial según zona',
  args : '<división>',
  run: async function (msg, args, client, command){
    const div = args[1] ? args[1].toLowerCase() : client.components.WorldRankingApi.defaultDivision
    const division = client.components.WorldRankingApi.divisions.indexOf(div) > -1 ? div : client.components.WorldRankingApi.defaultDivision
    msg.channel.sendTyping()
    return client.components.WorldRankingApi.get(division).then(r => {
      const top = r.leaderboard.slice(0,client.config.constants.worldBoardTop)
      const table = new Classes.Table([msg.author.locale('game.pos'),msg.author.locale('dota2.player')],null,["3f","20f"],{fill : '\u2002'})
      top.forEach((p,ix) => table.addRow([`#${ix+1}`,replace(p.name)]))
      return msg.reply({
        embed: {
          title : 'worldranking.title',
          description: 'worldranking.description',
          footer: {text : '<_date>', icon_url : '<_icon>'}
        }
      },{
        division: division,
        results: table.render(),
        divisions: client.components.WorldRankingApi.divisions.sort().join(', '),
        _date: Datee.custom(r.time_posted * 1000, 'h:m D/M/Y', true),
        _icon: client.config.images.dota2
      })
    }).catch(err => {
      return msg.reply('worldranking.error.request')
    })
  }
}


const replace = (text) => text.replace(/`/g,'')
