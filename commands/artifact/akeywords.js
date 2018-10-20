const { Command } = require('aghanim')

module.exports = new Command('akey',{
  category : 'Artifact', help : 'Información sobre las palabras clave del juego', args : '[palabra clave]'},
  function(msg, args, command){
    if(args[1]){
      const query = args.from(1).toLowerCase()
      const keyword = this.artifactCards.keywords.find(k => [k.name.toLowerCase(),...k.alias.map(a => a.toLowerCase())].includes(query))
      if(!keyword){return func(msg,this)}
      msg.reply({embed : {
        title : keyword.name + (keyword.alias.length ? ' (' + keyword.alias.map(a => a).join(', ') + ')' : ''),
        description : keyword.text,
        thumbnail : {url : keyword.image, height : 40, width : 40},
        footer : {text : 'Artifact keyword', icon_url : this.artifactCards.image},
        color : this.config.color
      }})
    }else{
      func(msg,this)
    }
  })


function func(msg,bot){
  return msg.reply({embed : {
    title : 'Artifact Keywords',
    description : bot.artifactCards.keywords.map(k => k.name).join(', '),
    // fields : [
    //   {name : 'name', value : 'value', inline : false}
    // ],
    footer : {text : 'Artifact keywords', icon_url : bot.artifactCards.image},
    color : bot.config.color
  }})
}
