const { Classes } = require('erisjs-utils')

module.exports = {
  name: ['searchworldranking','swr'],
  category : 'Dota 2',
  help : 'Busca a un jugador por nombre en la clasificación mundial',
  args : '<búsqueda>',
  requirements: [
    {
      validate: (msg, args, client, command, req) => args[1] || false,
      response: (msg, args, client, command, req) => msg.author.locale('searchworldranking.needquery')
    }
  ],
  run: async function (msg, args, client, command){
    // if (!args[1]) { return msg.reply()}
    const query = args.from(1)
    msg.channel.sendTyping();
    return client.components.WorldRankingApi.searchPlayerInWorld(query).then(r => {
      const table = new Classes.Table([msg.author.locale('region'), msg.author.locale('position')],null,['8','8r'],'\u2002')
      r.forEach(d => table.addRow([d.division,d.pos]))
      return msg.reply({
        embed: {
          title: 'searchworldranking.searchplayer',
          description: 'searchworldranking.resultssearchquery'
        }
      },{
        _query: query,
        _results: table.render()
      })
    }).catch(err => {
      return msg.reply('searchworldranking.errorfind', { _query: query})
    })
  }
}

const replace = (text) => text.replace(/`/g,'')
