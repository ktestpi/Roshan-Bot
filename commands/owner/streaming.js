const { Command } = require('aghanim')

module.exports = new Command('streaming',{
  category : 'Owner', help : 'Modifica el estado del bot a Streaming', args : '<link twitch> [mensaje]',
  ownerOnly : true},
  async function(msg, args, client){
    if(!args[1] || !args[1].startsWith('https://www.twitch.tv/')){return};
    let name;
    if(args.length === 2){name = args[1].match(new RegExp('https://www.twitch.tv/(.*)'))[1]}else{name = args.slice(2).join(' ')}
    return client.components.Bot.setStatus(1, client.config.status, name, args[1], true).then(() => client.components.Notifier.bot(`Streaming: **${name}**`))
  })
