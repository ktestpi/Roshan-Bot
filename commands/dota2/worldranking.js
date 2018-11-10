const { Command } = require('aghanim')
const { Datee, Classes } = require('erisjs-utils')

module.exports = new Command('worldranking',{
  category : 'Dota 2', help : 'Clasificación mundial según zona', args : '<división>'},
  function(msg, args, command){
    const div = args[1] ? args[1].toLowerCase() : this.plugins.WorldRankingApi.defaultDivision
    const division = this.plugins.WorldRankingApi.divisions.indexOf(div) > -1 ? div : this.plugins.WorldRankingApi.defaultDivision
    const lang = this.locale.getUserStrings(msg)
    msg.channel.sendTyping()
    return this.plugins.WorldRankingApi.get(division).then(r => {
      const top = r.leaderboard.slice(0,this.config.constants.worldBoardTop)
      const table = new Classes.Table([lang.pos,lang.player],null,["3f","20f"],{fill : '\u2002'})
      top.forEach((p,ix) => table.addRow([`#${ix+1}`,replace(p.name)]))
      return msg.reply({embed : {
        title : lang.worldboard + ' - ' + division,
        description :  table.render() + `\n**${lang.divisions}**: \`${this.plugins.WorldRankingApi.divisions.sort().join(', ')}\``,
        footer : {text : Datee.custom(r.time_posted*1000,'h:m D/M/Y',true), icon_url : this.config.images.dota2},
        color : this.config.color}
      })
    }).catch(err => {
      throw new UserError('worldranking', 'errorWorldRankingRequest', err)
  
    })
  })


const replace = (text) => text.replace(/`/g,'')
