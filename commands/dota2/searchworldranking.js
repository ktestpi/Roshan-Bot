const { Command } = require('aghanim')
const { Classes } = require('erisjs-utils')
const api = require('../../helpers/worldranking-api')

module.exports = new Command(['searchworldranking','swr'],{
  category : 'Dota 2', help : 'Busca a un jugador por nombre en la clasificación mundial', args : '<búsqueda>'},
  function(msg, args, command){
    // let self = this
    if(!args[1]){return msg.replyLocale('errorWorldBoardSearchPlayerQuery')}
    const query = args.from(1)
    const lang = this.locale.getUserStrings(msg)
    msg.channel.sendTyping();
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
      this.discordLog.send('error',this.locale.replacer(this.locale.getDevString('errorWorldBoardSearchPlayer'),{query}),this.locale.replacer(lang.errorWorldBoardSearchPlayer,{query}),err,msg.channel)
    })
  })

const replace = (text) => text.replace(/`/g,'')
