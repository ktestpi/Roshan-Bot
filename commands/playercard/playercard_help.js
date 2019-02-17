const { Command } = require('aghanim')
const enumPlayerPos = require('../../enums/player_positions')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'playercard.help.title',
  description: 'playercard.help.cmd',
  fields: [
    { name: 'playercard.help.heroestitle', value: 'playercard.help.heroesdescription', inline: false },
    { name: 'playercard.help.positiontitle', value: '<_positions>', inline: false },
    { name: 'playercard.help.exampletitle', value: 'playercard.help.exampledescription', inline: false }
  ],
  footer: { text: 'playercard.roshancard', icon_url: '<bot_avatar>' }
})

module.exports = new Command('help', {
  subcommandFrom: 'playercard',
  category : 'Account', help : 'Ayuda de la tarjeta de jugador@', args : ''},
  async function(msg, args, client){
    return msg.replyDM(embed, {
      _positions: `\`${enumPlayerPos.toArray().map(k => k.key).join(',')}\``
    })
    // return msg.replyDM({
    //   embed : {
    //     title: args.user.langstring('cardConfigTitle'),
    //     description : args.user.locale('cardHelpCommand'),
    //     fields : [
    //       {name : args.user.langstring('cardHelpHeroesTitle'), value : args.user.langstring('cardHelpHeroesDesc'), inline : false},
    //       {name : args.user.langstring('cardHelpPositionTitle') , value : `\`${enumPlayerPos.toArray().map(k => k.key).join(',')}\``, inline : false},
    //       {name : args.user.langstring('cardHelpExampleTitle') , value : args.user.locale('cardHelpExampleDesc'), inline : false}
    //     ],
    //     color : client.config.color
    //   }
    // })
  })
