const { Command } = require('aghanim')
const util = require('erisjs-utils')
const basic = require('../../helpers/basic')

module.exports = new Command('switches',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Control de los Switches', args : '<cmd>',
  ownerOnly : true},
  function(msg, args, command){
    if(args.length > 2){
      let update = {};
      // TODO: cache switches
      for(i in this.config.switches){
        if(i.toLowerCase() == args[2]){
          if(args[3] != '1' && args[3] != '0'){
            msg.reply('**' + i + '** ' + config.switches[i])
          }else if(args[3] == '1'){
            config.switches[i] = true;
            update[i] = true;
            config.db.child(`bot/switches`).update(update).then(() => msg.reply('**' + i + '** ' + this.config.switches[i]))
          }else if(args[3] == '0'){
            config.switches[i] = false;
            update[i] = false;
            config.db.child(`bot/switches`).update(update).then(() => msg.reply('**' + i + '** ' + this.config.switches[i]))
          }
        }
      }
    }else{
      let text = '__**Switches:**__\n';
      Object.keys(this.config.switches).sort().map(swit => `${basic.switchesEmojiStatus(swit.enable)} ${swit.name}`).join('\n')
      msg.reply(text);
    }
  })
