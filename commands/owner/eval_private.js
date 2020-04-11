const { Command } = require('aghanim')
const util = require('erisjs-utils')
const { inspect } = require('util')

module.exports = {
  name: ['evalp','ep'],
  category : 'Owner',
  help : '',
  args : '',
  hide : true,
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    if(!args[1]){return}
    let bot = client
    const _guild = msg.channel.guild
    const _channel = msg.channel
    const _user = msg.author
    let toEval = args.from(1)
    if(toEval.includes('return')){toEval=`(function(){${toEval}})()`}
    try{
      let result = eval(toEval)
      client.logger.eval('EvalPrivate: ' + toEval)
      Promise.resolve(result).then(res => {
        if(typeof result === 'object'){
          result = inspect(result)
        }
        result = String(result).slice(0,1000)
        client.logger.eval('EvalP Result: ' + result)
        return bot.owner.send(`**Expression**\n\`\`\`js\n${toEval}\`\`\`\n\n**${client.config.emojis.default.accept} Resultado**\n\`\`\`js\n${result}\`\`\``)
      }).catch(err => {
        client.logger.eval('EvalP Error: ' + err)
        return bot.owner.send(`**Expression**\n\`\`\`js\n${toEval}\`\`\`\n\n**${client.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
      })
    }catch(err){
      client.logger.eval('Code Error: ' + err.stack)
      return bot.owner.send(`**Expression**\n\`\`\`js\n${toEval}\`\`\`\n\n**${client.config.emojis.default.error} Code Error**\`\`\`js\n${err.stack}\`\`\``)
    }
  }
}
