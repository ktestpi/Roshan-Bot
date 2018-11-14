const { Command } = require('aghanim')

module.exports = new Command('cheese',{
  category : 'Fun', help : 'Da 1 <cheesed2>!', args : '<mención>'},
  function(msg, args, command){
    const lang = this.locale.getUserStrings(msg)
    if(msg.mentions.length == 0){return msg.reply(lang.errorCheeseCmdMentionNeccesary)}
    if(msg.mentions[0].id == msg.author.id){return msg.reply(lang.errorCheeseCmdNotYourself)}
    return msg.reply(this.locale.replacer(lang.cheeseGive,{author : msg.author.username, user : msg.mentions[0].username}));
  })
