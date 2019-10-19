const paintjimp = require('../../paintjimp')

module.exports = {
  name: 'playercard',
  category: 'Account',
  help: 'Muestra tu tarjeta de jugador',
  args: '',
  requirements: [
    'account.exist',
    {
      type: 'user.cooldown',
      time: 10,
      response: (msg, args, client, command, req) => msg.author.locale('warningInCooldown')
    }
  ],
  run: async function (msg, args, client, command){
    const { account } = args
    msg.channel.sendTyping()
    if(account.card.heroes.split('').length < 1){
      return client.components.Opendota.card_heroes(account.dota).then(results => {
        account.card.heroes = results[1].slice(0,3).map(h => h.hero_id).join(',')
        account.card.pos = 'all'
        return paintjimp.card([results[0],account.card])})
      .then(buffer => client.createMessage(client.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
      .then(m => msg.reply({
        embed: {
          image: {url: '<_image>'},
        }
      }, {
          _image : m.attachments[0].url
        }))
      .catch(err => {
        return msg.reply('error.opendotarequest')
      })
    }else{
      return client.components.Opendota.card(account.dota).catch(err => {return msg.reply('errorOpendotaRequest') })
        .then(results => paintjimp.card([...results,account.card]))
        .then(buffer => client.createMessage(client.config.guild.generated,'',{file : buffer, name : msg.author.username + '_roshan_card.png'}))
        .then(m => msg.reply({
          embed: {
            description: 'playercard.title',
            image: { url: '<_image>' },
          }
        }, {
            username: msg.author.username,
            social_links: client.components.Account.socialLinks(account),
            _image : m.attachments[0].url
          }))
    }
  }
}
