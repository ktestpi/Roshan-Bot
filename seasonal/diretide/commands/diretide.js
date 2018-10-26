const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('diretide',{
  category : 'Diretide', help : '', args : ''},
  function(msg, args, command){
    const game = command.game
    return game.replyDM(msg,game.status.embed({
      title : 'Diretide - Halloween Event',
      description : game.config.guide.description,
      // author :  {name : `${msg.author.username}'s bag`, icon_url : msg.author.avatarURL},
      thumbnail : {url : game.config.guide.thumbnail},
      fields : [
        {name : 'Objective', value : game.config.guide.objective, inline : false},
        {name : 'Actions', value : game.config.guide.actions.map(action => `\`r!${action.cmd}\` - ${action.text}`).join('\n'), inline : false},
        {name : 'Info', value : game.config.guide.info_actions.map(action => `\`r!${action.cmd}\` - ${action.text}`).join('\n'), inline : false}
      ],
      // {name : 'Actions', value : ``, inline : false}
      // ]
      footer : {text : game.config.guide.note}
    }))
  })
