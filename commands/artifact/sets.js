const { Command } = require('aghanim')

module.exports = new Command('sets',{
  category : 'Artifact', help : 'Información sobre los sets', args : '[nombre del set]'},
  function(msg, args, command){
    if(args[1]){
      const query = args.from(1).toLowerCase()
      const set = this.artifact.getSet(query)
      if(!set){return func(msg,this)}
      return msg.reply({embed : {
        title : 'Set info - ' + set.Name,
        description : set.description,
        thumbnail : {url : set.Image, height : 40, width : 40},
        fields : [
          {name : 'Summary', value : `**Hero:** ${set.Summary.Hero}\n**Creep:** ${set.Summary.Creep}\n**Spell:** ${set.Summary.Spell}\n**Improvement:** ${set.Summary.Improvement}\n**Weapon:** ${set.Summary.Weapon}\n**Armor:** ${set.Summary.Armor}\n**Accessory:** ${set.Summary.Accessory}\n**Consumible:** ${set.Summary.Consumible}\n`, inline : false},
        ],
        footer : {text : `${set.TotalCards} cards - Realease at ${set.Release}`},
        color : this.config.color
      }})
    }else{
      return func(msg,this)
    }
  })


function func(msg,bot){
  return msg.reply({embed : {
    title : 'Sets info',
    description : bot.artifact.sets.map(s => `**${s.Name}** - ${s.TotalCards} cards`).join('\n'),
    footer : {text : `${bot.artifact.sets.reduce((s,v) => s+v.TotalCards,0)} cards`},
    color : bot.config.color
  }})
}
