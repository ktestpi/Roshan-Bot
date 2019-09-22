const { Command } = require('aghanim')

module.exports = new Command('sets',{
  category : 'Artifact', help : 'Información sobre los sets', args : '[nombre del set]'},
  async function (msg, args, client, command){
    if(args[1]){
      const query = args.from(1).toLowerCase()
      const set = client.components.Artifact.getSet(query)
      if(!set){return func(msg,client)}
      return msg.reply(embed,{
        _set_name: set.name.english,
        _set_hero: set.summary.hero,
        _set_creep: set.summary.creep,
        _set_spell: set.summary.spell,
        _set_improvement: set.summary.improvement,
        _set_weapon: set.summary.weapon,
        _set_armor: set.summary.armor,
        _set_accesory: set.summary.accesory,
        _set_consumible: set.summary.consumible,
      })
    }else{
      return func(msg,client)
    }
  })


function func(msg, client){
  return msg.reply({
    embed: {
      title: 'Sets info',
      description: '<_sets>',
      footer: '<_cards> cards'
    }
  },{
    _sets: client.components.Artifact.sets.map(s => `**${s.name.english}** - ${s.totalCards} cards`).join('\n'),
    _cards: client.components.Artifact.sets.reduce((s, v) => s + v.totalCards, 0)
  })
}

//TODO langstring