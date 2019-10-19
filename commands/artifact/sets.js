module.exports = {
  name: 'sets', 
  category: 'Artifact',
  help: 'Información sobre los sets',
  args: '[nombre del set]',
  run: async function (msg, args, client, command){
    if(args[1]){
      const query = args.from(1).toLowerCase()
      const set = client.components.Artifact.getSet(query)
      if(!set){return showinfo(msg,client)}
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
      return showinfo(msg,client)
    }
  }
}


function showinfo(msg, client){
  return msg.reply({
    embed: {
      title: 'sets.info',
      description: '<_sets>',
      // footer: { text: '<_cards> cards' }
      footer: { text: '%%sets.cards%%' }
    }
  },{
    _sets: client.components.Artifact.sets.map(s => `**${s.name.english}** - ${s.totalCards} cards`).join('\n'),
    _cards: client.components.Artifact.sets.reduce((s, v) => s + v.totalCards, 0)
  })
}