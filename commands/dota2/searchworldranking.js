const { Command } = require('aghanim')
const { Classes } = require('erisjs-utils')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'searchworldranking.searchplayer',
  description: 'searchworldranking.resultssearchquery'
})

module.exports = new Command(['searchworldranking','swr'],{
  category : 'Dota 2', help : 'Busca a un jugador por nombre en la clasificación mundial', args : '<búsqueda>'},
  async function (msg, args, client, command){
    // let self = this
    if (!args[1]) { return msg.reply('searchworldranking.needquery')}
    const query = args.from(1)
    msg.channel.sendTyping();
    return client.components.WorldRankingApi.searchPlayerInWorld(query).then(r => {
      const table = new Classes.Table([msg.author.locale('region'), msg.author.locale('position')],null,['8','8r'],'\u2002')
      r.forEach(d => table.addRow([d.division,d.pos]))
      return msg.reply(embed,{
        _query: query,
        _results: table.render()
      })
    }).catch(err => {
      throw new UserError('worldranking', 'searchworldranking.errorfind', { _query: args[1]}, err)
    })
  })

const replace = (text) => text.replace(/`/g,'')
