const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const { Classes, Markdown } = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command(['competitive','comp'],{
  category : 'Dota 2', help : 'Últimos resultados de partidas competitivas', args : ''},
  function(msg, args, command){
    let self = this
    msg.channel.sendTyping();
    opendota.request('competitive').then(results => {
      if(results[0].error){return}
      const spacesBoard = ['19f','2f','19f','17f','11f'];
      var victory = ''
      var table = Classes.Table.renderRow([lang.radiant,lang.w,lang.dire,lang.league,lang.matchID], spacesBoard,'\u2002') + '\n';
      for (var i = 0; i < 8; i++) {
        if(results[0][i].radiant_win){ victory = '>>'}else{victory = '<<'}
        table += Classes.Table.renderRow([basic.parseText(results[0][i].radiant_name,'nf'),victory,basic.parseText(results[0][i].dire_name,'nf'), basic.parseText(results[0][i].league_name,'nf')], spacesBoard,'\u2002') + ' ' + Markdown.link('https://www.dotabuff.com/matches/' + results[0][i].match_id,results[0][i].match_id) + '\n';
      }
      msg.reply({embed : {
        title : lang.lastProMatchesTitle,
        description : table,
        color : this.config.color
      }})
    }).catch(err => this.discordLog('oderror',lang.errorOpendotaRequest,lang.errorOpendotaRequest,err,msg.channel))
  })
