const { Command } = require('aghanim')

module.exports = new Command('sets',{
  category : 'Artifact', help : 'Información sobre los sets', args : '[nombre del set]'},
  function(msg, args, command){
    if(args[1]){
      const query = args.from(1).toLowerCase()
      const set = this.artifactCards.getSetInfo(query)
      if(!set){return func(msg,this)}
      msg.reply({embed : {
        title : 'Set info - ' + set.name + (set.alias.length ? ' (' + set.alias.map(a => a).join(', ') + ')' : ''),
        description : set.description,
        thumbnail : {url : set.image, height : 40, width : 40},
        fields : [
          {name : 'Summary', value : `**Hero:** ${set.summary.hero}\n**Creep:** ${set.summary.creep}\n**Spell:** ${set.summary.spell}\n**Improvement:** ${set.summary.improvement}\n**Weapon:** ${set.summary.weapon}\n**Armor:** ${set.summary.armor}\n**Accessory:** ${set.summary.accessory}\n**Consumible:** ${set.summary.consumible}\n`, inline : false},
        ],
        footer : {text : `${set.totalcards} cards - Realease at ${set.releaseDate}`},
        color : this.config.color
      }})
    }else{
      func(msg,this)
    }
  })


function func(msg,bot){
  return msg.reply({embed : {
    title : 'Sets info',
    description : bot.artifactCards.getLanguageSets().map(c => `**${c.name}** - ${c.totalcards} cards`).join('\n'),
    // fields : [
    //   {name : 'name', value : 'value', inline : false}
    // ],
    footer : {text : `${bot.artifactCards.getLanguageSets().reduce((s,v) => s+v.totalcards,0)} cards`},
    color : bot.config.color
  }})
}
