const { Event } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Event('parse_artifact_cards','messageCreate',{}, function(msg,bot){
  this.artifactCards.sendMessageCard(msg,this.replace)
})
