const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const os = require('os')

module.exports = new Command('usage',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Uso del bot', args : '',
  ownerOnly : true},
  function(msg, args, command){
    let self = this
    util.os.getCPUUsage(function(cpuusage){
      msg.reply({embed : {
        title : `Rendimiento - ${os.platform()}`,
        fields : [
          {name : 'CPU', value : `${(cpuusage*100).toFixed(2)}%`, inline : true},
          {name : 'RAM', value : `${util.os.bytesConvert(os.totalmem()-os.freemem(),'MB')} / ${util.os.bytesConvert(os.totalmem(),'MB')} MB`, inline : true}
          // {name : , value : , inline : true}
        ],
        footer : {text : `Despierto ${basic.secondsTohms(Math.floor(process.uptime()))}`, icon_url : self.user.avatarURL},
        color : self.config.color
      }})
    })
  })
