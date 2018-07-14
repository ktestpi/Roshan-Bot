const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const enumHeroes = require('../helpers/enums/heroes')
const enumLobbyType = require('../helpers/enums/lobby')
const enumSkill = require('../helpers/enums/skill')

module.exports = new Command(['match','m'],{
  category : 'Dota 2', help : 'Estadísticas de una partida', args : '<id>'},
  function(msg, args, command){
    let self = this
    msg.channel.sendTyping();
    opendota.request('match',args[1]).then(results => {
      if(results[0].error){return}
      if(results[0].game_mode === 19){return msg.reply('Es una partida de evento. No se muestra información sobre ella.')}
      const spacesBoard = ['19','8','8','6','5','4','17'];
      var radiant = new util.table.new([lang.hero, lang.kda, lang.gpmxpm, lang.lhd, lang.hdmg, lang.tdmg, lang.player], spacesBoard);
      var dire = new util.table.new([lang.hero, lang.kda, lang.gpmxpm, lang.lhd, lang.hdmg, lang.tdmg, lang.player], spacesBoard);
      for (var i = 0; i < results[0].players.length; i++) {
        if(i < 5){
          radiant.addRow([enumHeroes(results[0].players[i].hero_id).name, results[0].players[i].kills + '/' + results[0].players[i].deaths + '/' + results[0].players[i].assists, results[0].players[i].gold_per_min + '/' + results[0].players[i].xp_per_min, results[0].players[i].last_hits + '/' + results[0].players[i].denies, util.number.tok(results[0].players[i].hero_damage) + lang.k, util.number.tok(results[0].players[i].tower_damage) + lang.k, results[0].players[i].name ? basic.parseText(results[0].players[i].name,'nf') : basic.parseText(results[0].players[i].personaname || lang.unknown,'nf')]);
        }else{
          dire.addRow([enumHeroes(results[0].players[i].hero_id).name, results[0].players[i].kills + '/' + results[0].players[i].deaths + '/' + results[0].players[i].assists, results[0].players[i].gold_per_min + '/' + results[0].players[i].xp_per_min, results[0].players[i].last_hits + '/' + results[0].players[i].denies, util.number.tok(results[0].players[i].hero_damage) + lang.k , util.number.tok(results[0].players[i].tower_damage) + lang.k,
          results[0].players[i].name ? basic.parseText(results[0].players[i].name,'nf') : basic.parseText(results[0].players[i].personaname ||lang.unknown,'nf')]);
        }
      }
      msg.reply({embed : {
        title : self.replace.do(lang.matchTitle,{victory : lang.victory, team : opendota.util.winnerTeam(results[0])},true),
        description : (results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType(results[0].lobby_type) + ' ' + enumSkill(results[0].skill)) +  ' `' + lang.matchID + ': ' + results[0].match_id + '` ' + util.md.link(self.config.links.profile.dotabuff.slice(0,-8) + 'matches/' + results[0].match_id,lang.moreInfo) + '\n' + self.replace.do(lang.matchTime,{duration : basic.durationTime(results[0].duration), time : util.date(results[0].start_time*1000,'hm/DMY')},true),
        fields : [
          {name : (results[0].radiant_team ? results[0].radiant_team.name : lang.radiant) + ' - ' + results[0].radiant_score,
          value : radiant.do(),
          inline : false},
          {name : (results[0].dire_team ? results[0].dire_team.name : lang.dire) + ' - ' + results[0].dire_score,
          value : dire.do(),
          inline : false},
        ],
        color : self.config.color
      }});
    }).catch(e => console.log(e))
    // opendota.odcall(this,msg,args,function(msg,args,profile){
    //
    // }) //.bind(this)
  })