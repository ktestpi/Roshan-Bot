const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('direstatus',{
  category : 'Diretide', help : '', args : '', ownerOnly : true},
  function(msg, args, command){
    const game = command.game
    return msg.reply({embed : {
      title : 'Diretide - Status',
      description : '',
      fields : [
        {name : 'Mode', value : game.status.getModeName(), inline : false},
        {name : 'Timeouts', value : `${timeRemainingTimeout(game.status.timeouts.sugarrush,'SugarRush',game.actions.secondsToHms)}\n${timeRemainingTimeout(game.status.timeouts.exhausted,'Exhausted',game.actions.secondsToHms)}\n${timeRemainingTimeout(game.status.timeouts.active,'Active',game.actions.secondsToHms)}`, inline : false}//,
        // {name : 'Duration', value : ` · ${timeSugarRush(game.status.sugarrush.next,'Next')}\n${timeSugarRush(game.status.sugarrush.current.start,'Current Start',game.actions.secondsToHms)}${timeSugarRush(game.status.sugarrush.current.end,'Current End',game.actions.secondsToHms)}\n\n`, inline : false}
      ],
      color : 0
    }
  })
})


function timeSugarRush(time,text){
  return time ? text + ': ' + Datee.custom(time,'h:m:s D/M') : ''
}

function timeRemainingTimeout(timeout,name,func){
  try{
    return name + ': ' + func(timeout.remaining())//+ ' - ' + func((timeout.endTime() + - Date.now)/1000)
  }catch(err){
    return name + ': Not established'
  }
}
