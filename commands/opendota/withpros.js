const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')

module.exports = new Command('withpros',{
  category : 'Dota 2', help : 'Pros con los que has jugado', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    let self = this
    opendota.odcall(this,msg,args,function(msg,args,profile){
      const lang = self.locale.getUserStrings(msg)
      msg.channel.sendTyping()
      opendota.request('player_pros',profile.profile.dota).then(results => {
        profile.profile.steam = basic.parseProfileURL(results[0].profile.profileurl,'steam');
        const resultsTotal = results[1].length;
        results[1].sort(function(){return .5 - Math.random()});
        var resultsShow = 0;
        let description = '';
        if(results[1].length > 0){
          for (var i = 0; i < results[1].length; i++) {
            if(results[1][i].team_tag != null){
              description += '**' + basic.parseText(results[1][i].name,'nf') + '** (' + basic.parseText(results[1][i].team_tag,'nf') + '), ';
            }else{description += '**' + basic.parseText(results[1][i].name,'nf') + '**, ';}
            resultsShow++
            if(description.length > self.config.constants.descriptionChars){break}
          }
          description = description.slice(0,-2);

        }else{description = lang.withProsNo};
        msg.reply({embed : {
          title : opendota.titlePlayer(results,lang.playerProfile,self.locale),
          description : description,
          thumbnail : {url : results[0].profile.avatarmedium, height : 40, width : 40},
          footer : {text: self.locale.replacer(lang.withProsFooter,{number : resultsShow !== resultsTotal ? resultsShow + "/" + resultsTotal : results[1].length}), icon_url : self.user.avatarURL},
          color : self.config.color
        }})
      }).catch(err => opendota.error(self,msg,err))
    })
  })
