module.exports = {
  name: 'thanks',
  category: 'General',
  help: 'Agradecimientos',
  args: '',
  run: async function (msg, args, client, command){
    return msg.reply({
      embed: {
        title : 'thanks.title',
        fields:[
          {name: 'thanks.fields0.name', value: '<_betatesters>', inline : false},
          {name: 'thanks.fields1.name', value: '<_complements>', inline : false}
        ]
      }
    }, {
      _betatesters: client.config.others.betatesters.join(', '),
      _complements: client.config.others.complements.map(c => `${c.tag}: ${c.author}`).join('\n')
    })
  }
}
