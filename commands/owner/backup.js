const { Command } = require('aghanim')
const { Firebase } = require('erisjs-utils')
const basic = require('../../helpers/basic')

module.exports = new Command('backup',{
  category : 'Owner', help : 'Realiza una copia de seguridad', args : '',
  ownerOnly : true},
  function(msg, args, command){
    Firebase.backupDBfile(this.db,this,this.config.guild.backup,{filenameprefix : 'roshan_db_', messageprefix : args[2] ? args.from(2) : '**Roshan Backup DB**'});
  })
