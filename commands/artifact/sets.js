const { Command } = require('aghanim')

module.exports = new Command('sets',{
  category : 'Artifact', help : 'Información sobre los sets', args : '[nombre del set]'},
  function(msg, args, command){
    if(args[1]){
      const query = args.from(1).toLowerCase()
      const set = this.plugins.Artifact.getSet(query)
      if(!set){return func(msg,this)}
      return msg.reply({embed : {
        title : 'Set info - ' + set.name.english,
        // description : set.description,
        // thumbnail : {url : set.Image, height : 40, width : 40},
        fields : [
          {name : 'Summary', value : `**Hero:** ${set.summary.hero}\n**Creep:** ${set.summary.creep}\n**Spell:** ${set.summary.spell}\n**Improvement:** ${set.summary.improvement}\n**Weapon:** ${set.summary.weapon}\n**Armor:** ${set.summary.armor}\n**Accessory:** ${set.summary.accessory}\n**Consumible:** ${set.summary.consumable}\n`, inline : false},
        ],
        footer: { text: `${set.totalCards} cards ` }, /*- Realease at ${set.Release}*/
        color : this.config.color
      }})
    }else{
      return func(msg,this)
    }
  })


function func(msg,bot){
  return msg.reply({embed : {
    title : 'Sets info',
    description : bot.plugins.Artifact.sets.map(s => `**${s.name.english}** - ${s.totalCards} cards`).join('\n'),
    footer : {text : `${bot.plugins.Artifact.sets.reduce((s,v) => s+v.totalCards,0)} cards`},
    color : bot.config.color
  }})
}
