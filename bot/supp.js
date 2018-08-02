const { Command } = require('aghanim')

module.exports = new Command(['supp'],{
  category : 'Owner', help : 'Supports', args : '[<add/remove> <mención>]',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    // if(!args[1]){return}
    if(['add','remove'].includes(args[1]) && args.length > 2){
      const cmd = args[1]
      const members = msg.mentions.map(m => m.id)
      const regex = new RegExp('\\d+')
      for (var i = 2; i < args.length; i++) {console.log(args[i],regex,regex.test(args[i]));
        if(regex.test(args[i])){members.push(args[i])}
      }
      if(!members.length){return}
      let promises = []
      members.forEach(m => promises.push(cmd === 'add' ? this.cache.supporters.include(m) : this.cache.supporters.exclude(m)))
      Promise.all(promises).then(msg.addReaction(this.config.emojis.default.accept)).catch(() => msg.reply(':x: Ha ocurrido un error'))
    }else{
      let supporters = this.cache.supporters.array().map(b => {
          let user = this.users.get(b)
          return user ? user.username : b
      })
      msg.reply({embed : {
        title : `Supports (${supporters.length})`,
        description : supporters.join(', '),
        color : this.config.color
      }})
    }
  })
