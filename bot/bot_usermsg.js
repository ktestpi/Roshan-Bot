const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('usermsg',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Mensaje a usuari@', args : '<id> [mensaje]',
  ownerOnly : true},
  function(msg, args, command){
    let self = this
    const id = args[2];
    const message = args.from(3)
    const user = this.users.find(user => user.id === id)
    if(!user){return}
    const embed = {
      author : {name : `Mensaje privado a: ${user.username}`, icon_url : user.avatarURL},
      // title : message.reason,
      description : message,
      // thumbnail : {url : owner.avatarURL, height : 40, width : 40},
      footer : {text : this.user.username ,icon_url : this.user.avatarURL},
      color : this.config.colors.sendMsg.owner
    }
    user.getDMChannel().then(channel => {
      channel.createMessage({embed})
      this.createMessage(this.config.guild.notifications,{embed})
    })
  })
