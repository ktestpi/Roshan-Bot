const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('backup',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Actualiza el mensaje de `r!patch`', args : '<mensaje del parche>',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    util.firebase.backupDBfile(this.db,this,this.guild.backup,{filenameprefix : 'roshan_db_', messageprefix : '**Roshan Backup DB**'});
  })
