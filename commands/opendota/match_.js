const { Command } = require('aghanim')
const { Datee, Markdown } = require('erisjs-utils')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const apijimp = require('../../helpers/apijimp')
const enumLobbyType = require('../../enums/lobby')
const enumSkill = require('../../enums/skill')

module.exports = new Command('match+',{
  category : 'Dota 2', help : 'Estadísticas de una partida. R+', args : '<id>', cooldown : 60,
  cooldownMessage : function(msg,args,command,cooldown){return this.locale.getUserString('warningInCooldown',msg)}},
  function(msg, args, command){
    if(!args[1]){return}
    const lang = this.locale.getUserStrings(msg)
    msg.channel.sendTyping();
    return opendota.request('match',args[1]).then(results => {
      if(results[0].error){return}
      if(results[0].game_mode === 19){return msg.reply(lang.matchEventNoInfo)}
      return apijimp.match(results[0])
      .then(buffer => this.createMessage(this.config.guild.generated,`**${msg.author.username}** pidió \`${args[1]}\``,{file : buffer, name : args[1]+".jpg"}))
      .then(m => {
        return msg.reply({embed : {
          title : this.locale.replacer(lang.matchTitle,{victory : lang.victory, team : opendota.util.winnerTeam(results[0])}),
          description : (results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type) + ' ' + (enumSkill.getValue(results[0].skill) || '')) +  ' `' + lang.matchID + ': ' + results[0].match_id + '` ' + Markdown.link(this.config.links.profile.dotabuff.slice(0,-8) + 'matches/' + results[0].match_id,lang.moreInfo) + '\n' + this.locale.replacer(lang.matchTime,{duration : basic.durationTime(results[0].duration), time : Datee.custom(results[0].start_time*1000,'h:m D/M/Y',true)}),
          image : { url : m.attachments[0].url},
          footer : { text : lang.roshanPlus, icon_url : this.user.avatarURL},
          color : this.config.color
      }})})
    })
    .catch(err => opendota.error(this,msg,err))
  })
