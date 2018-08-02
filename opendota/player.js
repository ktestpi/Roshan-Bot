const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const enumHeroes = require('../helpers/enums/heroes')

module.exports = new Command(['player','p'],{
  category : 'Dota 2', help : 'Información sobre un/a jugador/a', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    let self = this
    opendota.odcall(this,msg,args,function(msg,args,profile){
      msg.channel.sendTyping();
      opendota.request('player',profile.profile.dota).then(results => {
        profile.profile.steam = basic.parseProfileURL(results[0].profile.profileurl,'steam');
        let top5Heroes = ''
        for (var i = 0; i < 5; i++) {
          top5Heroes += self.replace.do(lang.top5Heroes,{hero : enumHeroes.getValue(results[2][i].hero_id).name, wr : opendota.util.winratio(results[2][i].win,results[2][i].games-results[2][i].win), games : results[2][i].games},true) + '\n'
        };
        const kda = opendota.util.kda(results[3][0].sum,results[3][1].sum,results[3][2].sum)
        msg.reply({embed : {
          title : opendota.titlePlayer(results,lang.playerProfile,self.replace),
          description : basic.socialLinks(profile.profile,'inline',self.config.links.profile) || '',
          fields : [
            {name : lang.wlr,
            value : results[1].win + '/' + results[1].lose + ' (' + opendota.util.winratio(results[1].win,results[1].lose) + '%)',
            inline : true},
            {name : lang.KDA,
            value : results[3][0].sum + '/' + results[3][1].sum + '/' + results[3][2].sum + ' (' + kda + ')',
            inline : false},
            {name : lang.top5HeroesTitle,
            value : top5Heroes,
            inline : true}
          ],
          thumbnail : {url : results[0].profile.avatarmedium, height : 40, width : 40},
          footer : {text : lang.noteData, icon_url : self.user.avatarURL},
          color : self.config.color
        }})
      }).catch(err => self.discordLog.send('oderror',lang.errorOpendotaRequest,lang.errorOpendotaRequest,err,msg.channel))
    }) //.bind(this)
  })
