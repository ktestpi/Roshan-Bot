const { Command } = require('drow')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('matches',{
  category : 'Dota 2', help : 'Últimas partidas jugadas', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    let self = this
    opendota.odcall(this,msg,args,function(msg,args,profile){
      msg.channel.sendTyping();
      opendota.request('player_matches',profile.id.dota).then(results => {
        profile.id.steam = basic.parseProfileURL(results[0].profile.profileurl,'steam');
        const spacesBoard = ['1','19','8','8','12'];
        let table = util.table.row([lang.wl, lang.hero, lang.kda, lang.duration.slice(0,3), lang.matchID], spacesBoard);
        for (let i = 0; i < 8; i++) {
          if(!results[1][i]){continue};
          table += util.table.rowRaw([opendota.util.winOrLose(results[1][i].radiant_win,results[1][i].player_slot).slice(0,1), opendota.enum.heroNamebyID(results[1][i].hero_id), results[1][i].kills + '/' + results[1][i].deaths + '/' + results[1][i].assists, basic.durationTime(results[1][i].duration)], spacesBoard)
          + '    ' + util.md.link('https://www.dotabuff.com/matches/' + results[1][i].match_id,results[1][i].match_id) + '\n';
        };
        msg.reply({embed : {
          title : opendota.titlePlayer(results,lang.playerProfile,self.replace),
          description : basic.socialLinks(profile.id,'inline',self.config.links.profile) || '',
          fields : [
            {name : lang.recentMatches + ' > ' + util.date(results[1][0].start_time*1000,'logdeco'),
            value : table,
            inline : true}
          ],
          thumbnail : {url : results[0].profile.avatarmedium, height : 40, width : 40},
          footer : {text : lang.noteData, icon_url : self.user.avatarURL},
          color : self.config.color
        }})
      }).catch(e => console.log(e))
    }) //.bind(this)
  })
