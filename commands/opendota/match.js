const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const enumHeroes = require('../../enums/heroes')
const enumLobbyType = require('../../enums/lobby')
const enumSkill = require('../../enums/skill')

module.exports = new Command(['match','m'],{
  category : 'Dota 2', help : 'Estadísticas de una partida', args : '<id>'},
  function(msg, args, command){
    if(!args[1]){return}
    msg.channel.sendTyping();
    opendota.request('match',args[1]).then(results => {
      if(results[0].error){return}
      if(results[0].game_mode === 19){return msg.replyLocale('matchEventNoInfo')}
      const spacesBoard = ['19f','8f','8f','6f','5f','4f','17f'];
      const lang = this.locale.getUserStrings(msg)
      var radiant = new util.Classes.Table([lang.hero, lang.kda, lang.gpmxpm, lang.lhd, lang.hdmg, lang.tdmg, lang.player],null,  spacesBoard, {fill: '\u2002'});
      var dire = new util.Classes.Table([lang.hero, lang.kda, lang.gpmxpm, lang.lhd, lang.hdmg, lang.tdmg, lang.player], null, spacesBoard, {fill:'\u2002'});
      for (var i = 0; i < results[0].players.length; i++) {
        if(i < 5){
          radiant.addRow([enumHeroes.getValue(results[0].players[i].hero_id).name, results[0].players[i].kills + '/' + results[0].players[i].deaths + '/' + results[0].players[i].assists, results[0].players[i].gold_per_min + '/' + results[0].players[i].xp_per_min, results[0].players[i].last_hits + '/' + results[0].players[i].denies, util.Number.tok(results[0].players[i].hero_damage) + lang.k, util.Number.tok(results[0].players[i].tower_damage) + lang.k, results[0].players[i].name ? basic.parseText(results[0].players[i].name,'nf') : basic.parseText(results[0].players[i].personaname || lang.unknown,'nf')]);
        }else{
          dire.addRow([enumHeroes.getValue(results[0].players[i].hero_id).name, results[0].players[i].kills + '/' + results[0].players[i].deaths + '/' + results[0].players[i].assists, results[0].players[i].gold_per_min + '/' + results[0].players[i].xp_per_min, results[0].players[i].last_hits + '/' + results[0].players[i].denies, util.Number.tok(results[0].players[i].hero_damage) + lang.k , util.Number.tok(results[0].players[i].tower_damage) + lang.k,
          results[0].players[i].name ? basic.parseText(results[0].players[i].name,'nf') : basic.parseText(results[0].players[i].personaname || lang.unknown,'nf')]);
        }
      }
      msg.reply({embed : {
        title : this.locale.replacer(lang.matchTitle,{victory : lang.victory, team : opendota.util.winnerTeam(results[0])}),
        description : (results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type) + ' ' + (enumSkill.getValue(results[0].skill) || '')) +  ' `' + lang.matchID + ': ' + results[0].match_id + '` ' + util.Markdown.link(this.config.links.profile.dotabuff.slice(0,-8) + 'matches/' + results[0].match_id,lang.moreInfo) + '\n' + this.locale.replacer(lang.matchTime,{duration : basic.durationTime(results[0].duration), time : util.Date.custom(results[0].start_time*1000,'h:m D/M/Y')}),
        fields : [
          {name : (results[0].radiant_team ? results[0].radiant_team.name : lang.radiant) + ' - ' + results[0].radiant_score,
          value : radiant.render(),
          inline : false},
          {name : (results[0].dire_team ? results[0].dire_team.name : lang.dire) + ' - ' + results[0].dire_score,
          value : dire.render(),
          inline : false},
        ],
        color : this.config.color
      }});
    }).catch(err => opendota.error(this,msg,err))
    // opendota.odcall(this,msg,args,function(msg,args,profile){
    //
    // }) //.bind(this)
  })
