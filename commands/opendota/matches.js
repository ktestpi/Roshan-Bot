const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')

module.exports = new Command('matches',{
  category : 'Dota 2', help : 'Últimas partidas jugadas', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    let self = this
    opendota.odcall(this,msg,args,function(msg,args,profile){
      const lang = self.locale.getUserStrings(msg)
      msg.channel.sendTyping();
      opendota.request('player_matches',profile.profile.dota).then(results => {
        profile.profile.steam = basic.parseProfileURL(results[0].profile.profileurl,'steam');
        const spacesBoard = ['1f','19f','8f','8f','12f'];
        let table = util.Classes.Table.renderRow([lang.wl, lang.hero, lang.kda, lang.duration.slice(0,3), lang.matchID], spacesBoard,'\u2002') +'\n';
        for (let i = 0; i < 8; i++) {
          if(!results[1][i]){continue};
          table += util.Classes.Table.renderRow([opendota.util.winOrLose(results[1][i].radiant_win,results[1][i].player_slot).slice(0,1), enumHeroes.getValue(results[1][i].hero_id).name, results[1][i].kills + '/' + results[1][i].deaths + '/' + results[1][i].assists, basic.durationTime(results[1][i].duration)], spacesBoard,'\u2002')
          + '    ' + util.Markdown.link('https://www.dotabuff.com/matches/' + results[1][i].match_id,results[1][i].match_id) + '\n';
        };
        msg.reply({embed : {
          title : opendota.titlePlayer(results,lang.playerProfile,self.locale),
          description : basic.socialLinks(profile.profile,'inline',self.config.links.profile) || '',
          fields : [
            {name : lang.recentMatches + ' > ' + util.Date.custom(results[1][0].start_time*1000,'[D/M/Y h:m:s]'),
            value : table,
            inline : true}
          ],
          thumbnail : {url : results[0].profile.avatarmedium, height : 40, width : 40},
          footer : {text : lang.noteData, icon_url : self.user.avatarURL},
          color : self.config.color
        }})
      }).catch(err => opendota.error(self,msg,err))
    }) //.bind(this)
  })