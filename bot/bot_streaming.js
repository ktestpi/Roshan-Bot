const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('streaming',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Modifica el estado del bot a Streaming', args : '<link twitch> [mensaje]',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    if(!args[2] || !args[2].startsWith('https://www.twitch.tv/')){return};
    let name;
    if(args.length === 3){name = args[2].match(new RegExp('https://www.twitch.tv/(.*)'))[1]}else{name = args.slice(3).join(' ')}
    this.editStatus("online", {name : name,type : 1, url : command[2]});
    this.logger.add('bot', `Streaming: **${name}**`,true)
  })
