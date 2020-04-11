const { inspect } = require('util')

module.exports = {
  name: ['eval','e'],
  category : 'Owner', help : '', args : '', hide : true,
  ownerOnly : true,
  run: async function(msg, args, client){
    // let self = this
    if(!args[1]){return}
    const bot = client
    const _guild = msg.channel.guild
    const _channel = msg.channel
    const _user = msg.author
    let toEval = args.from(1)
    if(toEval.includes('return')){toEval=`(function(){${toEval}})()`}
    try{
      const _message = msg
      const reply = msg.reply
      let result = eval(toEval)
      client.components.loger.eval('Eval: ' + toEval)
      Promise.resolve(result).then(res => {
        if(typeof result === 'object'){
          result = inspect(result)
        }
        result = String(result).slice(0,1000)
        client.logger.eval('Eval Result: ' + result)
        return msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${client.config.emojis.default.accept} Resultado**\n\`\`\`js\n${result}\`\`\``)
      }).catch(err => {
        client.logger.eval('Eval Error: ' + err)
        return msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${client.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
      })
    }catch(err){
      client.logger.eval('Code Error: ' + err.stack)
      return msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${client.config.emojis.default.error} Code Error**\`\`\`js\n${err.stack}\`\`\``)
    }

  }
}
