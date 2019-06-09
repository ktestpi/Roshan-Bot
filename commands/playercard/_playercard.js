const { Command } = require('aghanim')
const paintjimp = require('../../paintjimp')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  image: {url: '<_image>'},
})

const embed2 = new EmbedBuilder({
  description: 'playercard.title',
  image: { url: '<_image>' },
})

module.exports = new Command('playercard',{
  category : 'Account', help : 'Muestra tu tarjeta de jugador', args : '', cooldown : 10,
  cooldownMessage : function(msg, args, client, cooldown){return msg.reply('warningInCooldown')}},
  async function(msg, args, client){
    const user = msg.mentions.length ? msg.mentions[0] : msg.author
    return client.components.Account.exists(msg.author.id)
      .then(account => {
        msg.channel.sendTyping();
        if(account.card.heroes.split('').length < 1){
          return client.components.Opendota.card_heroes(account.dota).catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err ) }).then(results => {
            account.card.heroes = results[1].slice(0,3).map(h => h.hero_id).join(',')
            account.card.pos = 'all'
            return paintjimp.card([results[0],account.card])})
          .then(buffer => client.createMessage(client.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
          .then(m => msg.reply(embed, {
              _image : m.attachments[0].url
            }))
          .catch(err => {
            throw new UserError('opendota', 'error.opendotarequest', null, err)
          })
        }else{
          return client.components.Opendota.card(account.dota).catch(err => {throw new UserError('opendota', 'errorOpendotaRequest', err ) })
            .then(results => paintjimp.card([...results,account.card]))
            .then(buffer => client.createMessage(client.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
            .then(m => msg.reply(embed2, {
                username: user.username,
                social_links: client.components.Account.socialLinks(account),
                _image : m.attachments[0].url
              }))
            .catch(err => {
              throw new UserError('opendota', 'error.opendotarequest', err)
            })
        }
    })
  })
