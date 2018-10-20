const { Command } = require('aghanim')
const basic = require('../../helpers/basic')

module.exports = new Command(['beta'],{
  category : 'Owner', help : 'Betatesters', args : '[<add/remove> <mención>]',
  ownerOnly : true},
  function(msg, args, command){
    if(['add','remove'].includes(args[1]) && args.length > 2){
      const cmd = args[1]
      const members = msg.mentions.map(m => m.id)
      const regex = new RegExp('\\d+')
      for (var i = 2; i < args.length; i++) {
        if(regex.test(args[i])){members.push(args[i])}
      }
      if(!members.length){return}
      let promises = []
      members.forEach(m => promises.push(cmd === 'add' ? this.cache.betatesters.include(m) : this.cache.betatesters.exclude(m)))
      return Promise.all(promises).then(msg.addReaction(this.config.emojis.default.accept)).catch(() => msg.reply(':x: Ha ocurrido un error'))
    }else{
      let betatesters = this.cache.betatesters.array().map(b => {
          let user = this.users.get(b)
          return user ? user.username : b
      })
      return msg.reply({embed : {
        title : `Betatesters (${betatesters.length})`,
        description : betatesters.join(', '),
        color : this.config.color
      }})
    }
  })
