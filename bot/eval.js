const { Command } = require('aghanim')
const util = require('erisjs-utils')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const { inspect } = require('util')

module.exports = new Command(['eval','e'],{
  category : 'Owner', help : '', args : '', hide : true,
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    if(!args[1]){return}
    let bot = this
    let bla = this
    const _guild = msg.channel.guild
    const _channel = msg.channel
    const _user = msg.author
    let toEval = args.from(1)
    if(toEval.includes('return')){toEval=`(function(){${toEval}})()`}
    try{
      const _message = msg
      const reply = msg.reply
      let result = eval(toEval)
      console.log(`Eval: ${toEval}`);
      Promise.resolve(result).then(res => {
        if(typeof result === 'object'){
          result = inspect(result)
        }
        result = String(result).slice(0,1000)
        console.log(`Eval Resultado: ${result}`);
        msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.accept} Resultado**\n\`\`\`js\n${result}\`\`\``)
      }).catch(err => {
        console.log(`Eval Error: ${err}`);
        msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
      })
    }catch(err){
      console.log(`Code Error: ${err.stack}`);
      msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.error} Code Error**\`\`\`js\n${err.stack}\`\`\``)
    }

  })
