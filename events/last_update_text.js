const { Event } = require('aghanim')
const lang = require('../lang.json')
const { resetServerConfig } = require('../helpers/basic.js')
const { Datee } = require('erisjs-utils')

module.exports = new Event('','messageCreate',{}, function(msg,bot){
  if(msg.channel.id === this.config.guild.changelog){
    this.loadLastUpdateText()
  }
})
