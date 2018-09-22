const { Event } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Event('','messageCreate',{}, function(msg,bot){
    this.artifactCards.sendMessageCard(msg,this.replace)
})
