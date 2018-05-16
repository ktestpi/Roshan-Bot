const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('backup',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Realiza una copia de seguridad', args : '<mensaje>',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    util.firebase.backupDBfile(this.db,this,this.config.guild.backup,{filenameprefix : 'roshan_db_', messageprefix : args[2] ? args.from(2) : '**Roshan Backup DB**'});
  })
