const { Command } = require('aghanim')

module.exports = new Command('akey',{
  category : 'Artifact', help : 'Información sobre las palabras clave del juego', args : '[palabra clave]'},
  async function (msg, args, client, command){
    const query = args.from(1).toLowerCase()
    const keyword = client.components.Artifact.keywords.find(k => [k.name.toLowerCase(),...k.alias.map(a => a.toLowerCase())].includes(query))
    if (keyword){
      return msContentScript.reply({
        title: '<_keyword_name><_keyword_alias>',
        descrition: '<_keyword_text>',
        thumbnail: {url : '<_keyword_image>'},
        footer : {text : 'Artifact keyword', icon_url : '<_artifact_logo>'}
      },{
        _keyword_text: keyword.text,
        _keyword_alias: keyword.alias.length ? ' (' + keyword.alias.map(a => a).join(', ') + ')' : '',
        _keyword_image: keyword.image,
        _artifact_logo: client.components.Artifact.logo
      })
    }else{
      return msg.reply({
        title : 'Artifact Keywords',
        description: '<_keywords>',
        footer : {text : 'Artifact Keywords', icon_url : '<_artifact_logo>'}
      },{
        _keywords: client.components.Artifact.keywords.map(k => k.name).join(', '),
        _artifact_logo: client.components.Artifact.logo
      })
    }
  })

  //TODO langstring