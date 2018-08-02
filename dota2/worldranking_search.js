const { Command } = require('aghanim')
// const opendota = require('../helpers/opendota')
// const basic = require('../helpers/basic')
const lang = require('../lang.json')
const { Classes } = require('erisjs-utils')
const api = require('../helpers/worldranking-api')

module.exports = new Command('search',{
  subcommandFrom : 'worldranking',
  category : 'Dota 2', help : 'Busca a un jugador por nombre en la clasificación mundial', args : '<búsqueda>'},
  function(msg, args, command){
    // let self = this
    if(!args[2]){return msg.reply(lang.errorWorldBoardSearchPlayerQuery)}
    const query = args.from(2)
    api.searchPlayerInWorld(query).then(r => {
      // console.log(r);
      // throw new Error('TestingError')
      const table = new Classes.Table([lang.region,lang.position],null,['8','8r'],'\u2002')
      r.forEach(d => table.addRow([d.division,d.pos]))
      msg.reply({embed : {
        title : lang.worldboardSeachPlayer,
        description : lang.search + ': ' + `\`${query}\`\n\n${table.render()}`,
        color : this.config.color
      }})
    }).catch(err => {
      const error = lang.errorWorldBoardSearchPlayer.replaceKey({query})
      this.discordLog.send('error',error,error,err,msg.channel)
    })
  })

const replace = (text) => text.replace(/`/g,'')
