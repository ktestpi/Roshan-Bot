const { Command } = require('aghanim')
const { Datee, Markdown } = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const apijimp = require('../helpers/apijimp')
const enumLobbyType = require('../helpers/enums/lobby')
const enumSkill = require('../helpers/enums/skill')

module.exports = new Command('match+',{
  category : 'Dota 2', help : 'Estadísticas de una partida. R+', args : '<id>', cooldown : 60, cooldownMessage : lang.warningInCooldown},
  function(msg, args, command){
    let self = this
    if(!args[1]){return}
    msg.channel.sendTyping();
    return opendota.request('match',args[1]).then(results => {
      if(results[0].error){return}
      if(results[0].game_mode === 19){return msg.reply('Es una partida de evento. No se muestra información sobre ella.')}
      return apijimp.match(results[0])
      .then(buffer => self.createMessage(self.config.guild.generated,`**${msg.author.username}** pidió \`${args[1]}\``,{file : buffer, name : args[1]+".jpg"}))
      .then(m => msg.reply({embed : {
        title : self.replace.do(lang.matchTitle,{victory : lang.victory, team : opendota.util.winnerTeam(results[0])},true),
        description : (results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type) + ' ' + (enumSkill.getValue(results[0].skill) || '')) +  ' `' + lang.matchID + ': ' + results[0].match_id + '` ' + Markdown.link(self.config.links.profile.dotabuff.slice(0,-8) + 'matches/' + results[0].match_id,lang.moreInfo) + '\n' + self.replace.do(lang.matchTime,{duration : basic.durationTime(results[0].duration), time : Datee.custom(results[0].start_time*1000,'h:m D/M/Y',true)},true),
        image : { url : m.attachments[0].url},
        footer : { text : lang.roshanPlus, icon_url : this.user.avatarURL},
        color : self.config.color
      }}))
    })
    .catch(err => this.discordLog.send('oderror',lang.errorOpendotaRequest,lang.errorOpendotaRequest,err,msg.channel))
    // return opendota.request('match',args[1]).then(results => {
    //   if(results[0].error){return}
    //   if(results[0].game_mode === 19){return msg.reply('Es una partida de evento. No se muestra información sobre ella.')}
    //   return apijimp.match(results[0]).then(data => {
    //     return self.createMessage(self.config.guild.generated,`**${msg.author.username}** pidió \`${args[1]}\``,{file : data, name : args[1]+".jpg"}).then(m => {
    //       return msg.reply({embed : {
    //         title : self.replace.do(lang.matchTitle,{victory : lang.victory, team : opendota.util.winnerTeam(results[0])},true),
    //         description : (results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType(results[0].lobby_type) + ' ' + enumSkill(results[0].skill)) +  ' `' + lang.matchID + ': ' + results[0].match_id + '` ' + util.md.link(self.config.links.profile.dotabuff.slice(0,-8) + 'matches/' + results[0].match_id,lang.moreInfo) + '\n' + self.replace.do(lang.matchTime,{duration : basic.durationTime(results[0].duration), time : util.date(results[0].start_time*1000,'hm/DMY')},true),
    //         image : { url : m.attachments[0].url},
    //         footer : { text : lang.roshanPlus, icon_url : this.user.avatarURL},
    //         color : self.config.color
    //       }})
    //       command.setCooldown(msg.author.id)
    //     })
    //   })
    // }).catch(err => opendota.error(self,msg,lang.errorOpendotaRequest,err))
  })
