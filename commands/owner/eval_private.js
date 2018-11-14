const { Command } = require('aghanim')
const util = require('erisjs-utils')
const { inspect } = require('util')

module.exports = new Command(['evalp','ep'],{
  category : 'Owner', help : '', args : '', hide : true,
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    if(!args[1]){return}
    let bot = this
    const _guild = msg.channel.guild
    const _channel = msg.channel
    const _user = msg.author
    let toEval = args.from(1)
    if(toEval.includes('return')){toEval=`(function(){${toEval}})()`}
    try{
      let result = eval(toEval)
      this.notifier.console('EvalPrivate',toEval)
      Promise.resolve(result).then(res => {
        if(typeof result === 'object'){
          result = inspect(result)
        }
        result = String(result).slice(0,1000)
        this.notifier.console('EvalP Result', result)
        bot.owner.send(`**Expression**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.accept} Resultado**\n\`\`\`js\n${result}\`\`\``)
      }).catch(err => {
        this.notifier.console('EvalP Error', err)
        bot.owner.send(`**Expression**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
      })
    }catch(err){
      this.notifier.console('Code Error', err.stack)
      bot.owner.send(`**Expression**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.error} Code Error**\`\`\`js\n${err.stack}\`\`\``)
    }
  })
