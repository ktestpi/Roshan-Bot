const { Command } = require('aghanim')
const dotamicon = require('../../containers/dotamicon.json')

module.exports = new Command('dotamicon',{
  category : 'General', help : 'Dotamicon', args : '<búsqueda>', enable: false},
  async function (msg, args, client, command){
    // if(!args[1] || !dotamicon[args[1]]){return basic.wrongCmd(msg,dotamicon,args.until(1))}
    // let embed = basic.replaceMessageFields(dotamicon[args[1]],{},this.replace,(text) => basic.parseText(text,'nf'))
    // if(embed.color){embed.color = basic.replaceColor(embed.color,this.config.colors.palette)}
    // if(embed.footer && embed.footer.icon_url){embed.footer.icon_url = replaceFooterIcon(embed.footer.icon_url)}
    // return msg.reply({embed})
  })

