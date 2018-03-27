const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('withpros',{
  category : 'Dota 2', help : 'Pros con los que has jugado', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    let self = this
    opendota.odcall(this,msg,args,function(msg,args,profile){
      msg.channel.sendTyping();
      opendota.request('player_pros',profile.id.dota).then(results => {
        profile.id.steam = basic.parseProfileURL(results[0].profile.profileurl,'steam');
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
          title : opendota.titlePlayer(results,lang.playerProfile,self.replace),
          description : description,
          thumbnail : {url : results[0].profile.avatarmedium, height : 40, width : 40},
          footer : {text: self.replace.do(lang.withProsFooter,{number : resultsShow !== resultsTotal ? resultsShow + "/" + resultsTotal : results[1].length},true), icon_url : self.user.avatarURL},
          color : self.config.color
        }})

        // opendota.odcall(this,msg,args,function(msg,args,profile){
        //
        // }) //.bind(this)
      }).catch(e => console.log(e))
    })
  })
