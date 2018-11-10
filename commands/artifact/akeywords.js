const { Command } = require('aghanim')

module.exports = new Command('akey',{
  category : 'Artifact', help : 'Información sobre las palabras clave del juego', args : '[palabra clave]'},
  function(msg, args, command){
    const query = args.from(1).toLowerCase()
    const keyword = this.plugins.Artifact.keywords.find(k => [k.name.toLowerCase(),...k.alias.map(a => a.toLowerCase())].includes(query))
    if (keyword){
      return msg.reply({embed : {
        title : keyword.name + (keyword.alias.length ? ' (' + keyword.alias.map(a => a).join(', ') + ')' : ''),
        description : keyword.text,
        thumbnail : {url : keyword.image, height : 40, width : 40},
        footer : {text : 'Artifact keyword', icon_url : this.plugins.Artifact.logo},
        color : this.config.color
      }})
    }else{
      return msg.reply({
        embed: {
          title: 'Artifact Keywords',
          description: this.plugins.Artifact.keywords.map(k => k.name).join(', '),
          footer: { text: 'Artifact keywords', icon_url: this.plugins.Artifact.logo },
          color: this.config.color
        }
      })
    }
  })
