const { Event } = require('aghanim')
const { resetServerConfig } = require('../helpers/basic.js')
const { Datee } = require('erisjs-utils')

module.exports = new Event('last_update_text','messageCreate',{}, function(msg,bot){
  if(msg.channel.id === this.config.guild.changelog){
    this.loadLastPatchNotes()
  }
})
