const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('emojis',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Resetea y muestra los emojis del bot', args : '<reset,show>',
  ownerOnly : true},
  function(msg, args, command){
    console.log(this.config.emojis.bot);
    if(args[2] == 'reset'){
      this.config.emojis.bot = util.guild.loadEmojis(bot.guilds.get(this.config.guild.id));
      msg.addReaction(config.emojis.default.accept);
    }else if(args[2] == 'show'){

      msg.reply('__**Emojis Bot**__\n\n' + Object.keys(this.config.emojis.bot).sort().map(emoji => this.config.emojis.bot[emoji]).join(', '));
    }
  })
