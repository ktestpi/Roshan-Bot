const { Command } = require('aghanim')
const { Os } = require('erisjs-utils')
const basic = require('../helpers/basic')
const os = require('os')

module.exports = new Command('usage',{
  category : 'Owner', help : 'Uso del bot', args : '',
  ownerOnly : true},
  function(msg, args, command){
    Os.getCPUUsage(cpuusage => {
      msg.reply({embed : {
        title : `Rendimiento - ${os.platform()}`,
        fields : [
          {name : 'CPU', value : `${(cpuusage*100).toFixed(2)}%`, inline : true},
          {name : 'RAM', value : `${Os.bytesConvert(os.totalmem()-os.freemem(),'MB')} / ${Os.bytesConvert(os.totalmem(),'MB')} MB`, inline : true}
          // {name : , value : , inline : true}
        ],
        footer : {text : `Despierto ${basic.secondsTohms(Math.floor(process.uptime()))}`, icon_url : this.user.avatarURL},
        color : this.config.color
      }})
    })
  })
