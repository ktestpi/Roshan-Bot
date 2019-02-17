const { Command } = require('aghanim')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'searchcard.title',
  fields : [
    {name: 'searchcard.text', value: '<_query>', inline: false},
    {name : 'searchcard.cards', value: '<_cards>', inline: false}
  ],
  footer: {text : 'searchcard.results'}
})

const max = 1024
module.exports = new Command(['searchcard','scard'],{
  category : 'Artifact', help : 'Busca cartas según texto', args : '<texto>'},
  async function(msg, args, client){
    const query = args.from(1)
    if(!query){return}
    const filtered = client.components.Artifact.searchCard(query)
    if(!filtered.length){return msg.reply('searchcard.notfound',{query})}
    const reduced = reduceWithCount(filtered.map(c => c.name.english),max)
    return msg.reply(embed,{
      _query: query,
      _cards: reduced.text,
      results: reduced.count === filtered.length ? reduced.count : reduced.count + '/' + filtered.length
    })
  })

  function reduceWithCount(array,max){
    let result = {count : 0, text : ''}
    result.text = array.reduce((acc,cur) => {
      if((acc + ', ' + cur).length < max){result.count++;return acc + ', ' + cur}
      else{return acc}
    })
    result.count++
    return result
  }
