const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('account',{
  category : 'Cuenta', help : 'Muestra/modifica tu cuenta', args : '[dotaID] [steamID] [twithID] [twitterID]'},
  function(msg, args, command){
    let self = this
    const profile = this.cache.profiles.get(msg.author.id)
    if(args.length < 2){
      if(!profile){return basic.needRegister(msg,msg.author.id)} //TODO: needRegister
      msg.author.getDMChannel().then(channel => {
        channel.createMessage({
          embed : {
            title : lang.urRoshanAccount,
            description : self.replace.do('dataRoshanAccount',{dotaID : profile.profile.dota, steamID : profile.profile.steam, twitchID : profile.profile.twitch, twitterID : profile.profile.twitter},true),
            thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
            footer : {text : self.replace.do(lang.botCreated),icon_url : self.user.avatarURL},
            color: self.config.color
          }
        })
      })
    }else{
      if(!profile){return} //TODO: ya registrado
      const server = this.config.guild;
      let account = {dota : args[1] || '' ,steam : args[2] || '', twitch : args[3] || '', twitter : args[4] || ''};
      const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
      const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
      let msgServer = {}, msgChannel, color;
      for(i in account){
        if(account[i] == '-' || account[i] === ''){account[i] = profile.profile[i]}
        else{account[i] = basic.parseProfileURL(account[i],i)}
      }
      if(account.dota){
        util.request.getJSON('https://api.opendota.com/api/players/' + account.dota).then(result => {
          if(!result.profile){msg.addReaction(self.config.emojis.default.error);return}; //TODO need register
          this.logger.add('accountmodify',msg.author.username,true);
          self.createMessage(server.accounts,{
            embed : {
              title : 'Modificar cuenta' + ' - ' + msg.author.id,
              description : self.replace.do(`**Guild/DM:** \`${guildName}\` **ID:** \`${guildID}
              \`\n<dota> <dotaID>\n<steam> <steamID>\n<twitch> <twitchID>\n<twitter> <twitterID>`,{dotaID: account.dota, steamID : account.steam, twitchID : account.twitch, twitterID : account.twitter},true),
              //thumbnail : {url : config.icon, height : 40, width : 40},
              footer : {text : msg.author.username + ' | ' + msg.author.id + ' | ' + util.date(msg.timestamp,'log') ,icon_url : msg.author.avatarURL},
              color: self.config.colors.account.modify}
          }).then(m => {
              msg.addReaction(this.config.emojis.default.envelopeIncoming)
              self.cache.profiles.modify(msg.author.id,{profile : account}).then(() => {
                msg.author.getDMChannel().then((channel) => {
                  channel.createMessage({
                    embed : {
                      title : 'Actualización de los datos',
                      //author : {name : config.bot.name, icon_url : config.bot.icon},
                      description : '¡Muchas gracias por actualizar tu cuenta!',
                      fields : [{
                        name : 'Nuevos datos',
                        value : self.replace.do('<dota> <dotaID>\n<steam> <steamID>\n<twitch> <twitchID>\n<twitter> <twitterID>\n',{dotaID : account.dota, steamID : account.steam, twitchID : account.twitch, twitterID : account.twitter},true),
                        inline : false
                      }],
                      thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
                      footer : {text : self.replace.do(lang.botCreated),icon_url : self.user.avatarURL},
                      color: self.config.color
                    }
                  })
                })
              })
          })
        })
      }
    }
  })

function func(msg,args,profile,bot){
  let user = msg.channel.type === 0 ? msg.channel.guild.members.get(profile.account_id) : msg.author
  msg.reply({
    embed : {
      title : bot.replace.do(lang.userInfoTitle,{username : user.username},true),
      fields : [
        {name : lang.userInfoIDTitle,
        value : basic.socialLinks(profile.profile,'vertical'),//socialLinks(config.links.profile,snap.val().profile,'verticalIDMinL'),
        inline : true}],
      thumbnail : {url : user.avatarURL, height : 40, width : 40},
      color : bot.config.color
    }
  })
}
