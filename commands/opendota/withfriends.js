const { Command } = require('aghanim')
const { Classes } = require('erisjs-utils')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')

module.exports = new Command(['withfriends','friends'],{
  category : 'Dota 2', help : 'Estadísticas de partidas jugadas con amig@s', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    let self = this
    opendota.odcall(this,msg,args,function(msg,args,profile){
      const lang = self.locale.getUserStrings(msg)
      msg.channel.sendTyping()
      opendota.request('player_friends',profile.profile.dota).then(results => {
        profile.profile.steam = basic.parseProfileURL(results[0].profile.profileurl,'steam');
        results[1] = results[1].filter(friend => friend.with_games > 0);
        const spacesBoard = ['25f','3cf','6cf'];
        let table = Classes.Table.renderRow([basic.parseText(lang.player,'nf'),lang.games.slice(0,1),lang.gamesWR], spacesBoard,'\u2002') + '\n';
        if(results[1].length > 0){
          for (var i = 0; i < results[1].length; i++) {
            table += Classes.Table.renderRow([results[1][i].personaname,results[1][i].with_games,opendota.util.winratio(results[1][i].with_win,results[1][i].with_games - results[1][i].with_win) + '%'], spacesBoard,'\u2002') + '\n';
            if(table.length > self.config.constants.descriptionChars){break}
          }
        }
        msg.reply({embed : {
          title : opendota.titlePlayer(results,lang.playerProfile,self.locale),
          description : results[1].length > 0 ? table : lang.withFriendsNo,
          thumbnail : {url : results[0].profile.avatarmedium, height : 40, width : 40},
          footer : {text: self.locale.replacer(lang.withFriendsFooter,{number : results[1].length > 0 ? results[1].length : '0'}), icon_url : self.user.avatarURL},
          color : self.config.color
        }})

        // opendota.odcall(this,msg,args,function(msg,args,profile){
        //
        // }) //.bind(this)
      }).catch(err => opendota.error(self,msg,err))
    })
  })