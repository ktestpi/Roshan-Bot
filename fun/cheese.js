const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('cheese',{
  category : 'Fun', help : 'Da 1 <cheesed2>!', args : '<mención>'},
  function(msg, args, command){
    if(msg.mentions.length == 0){return msg.reply(lang.errorCheeseCmdMentionNeccesary)}
    if(msg.mentions[0].id == msg.author.id){return msg.reply(lang.errorCheeseCmdNotYourself)}
    msg.reply(this.replace.do(lang.cheeseGive,{author : msg.author.username, user : msg.mentions[0].username},true));
  })
