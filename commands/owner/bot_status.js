const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')

module.exports = new Command('status',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Establece el estado de conexión a mostrar', args : '<0,online,1,idle,2,dnd,3,invisible>',
  ownerOnly : true},
  function(msg, args, command){
    const status_mode = {
      '0' : 'online',
      online : 'online',
      '1' : 'idle',
      idle : 'idle',
      '2' : 'dnd',
      dnd : 'dnd',
      '3' : 'invisible',
      invisible : 'invisible'
    }
    const status_modes = Object.keys(status_mode)
    let _status = args[2]
    if(!_status){
      this.setStatus('online',null,null,null,true).then(() => this.discordLog.controlMessage('bot', `Status to default`)).catch(err => this.discordLog.controlMessage('error','Ha ocurrido un error al cambiar de estado', err))
    }else{
      _status = _status.toLowerCase()
      if(status_modes.includes(_status)){
        const status_save = status_mode[_status]
        this.setStatus(null,status_save,null,null,true).then(() => this.discordLog.controlMessage('bot', `Status to ${status_save}`)).catch(err => this.discordLog.controlMessage('error','Ha ocurrido un error al cambiar de estado', err))
      }
    }
  })
