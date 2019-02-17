const { Command } = require('aghanim')
const { Firebase } = require('erisjs-utils')

module.exports = new Command('backup',{
  category : 'Owner', help : 'Realiza una copia de seguridad', args : '',
  ownerOnly : true},
  async function(msg, args, client){
    Firebase.backupDBfile(client.db,client,client.config.guild.backup,{filenameprefix : 'roshan_db_', messageprefix : args[2] ? args.from(2) : '**Roshan Backup DB**'});
  })
