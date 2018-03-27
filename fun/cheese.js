const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('cheese',{
  category : 'Fun', help : 'Da 1 <cheesed2>!', args : '<mención>'},
  function(msg, args, command){
    let self = this
    if(msg.mentions.length == 0){return}
    if(msg.mentions[0].id == msg.author.id){msg.addReaction(this.config.emojis.default.error);return}
    msg.reply(this.replace.do(lang.cheeseGive,{author : msg.author.username, user : msg.mentions[0].username},true));
  })
