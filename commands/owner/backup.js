const { Firebase } = require('erisjs-utils')

module.exports = {
  name: 'backup',
  category : 'Owner',
  help : 'Realiza una copia de seguridad',
  args : '',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    return Firebase.backupDBfile(client.db,client,client.config.guild.backup,{filenameprefix : 'roshan_db_', messageprefix : args[2] ? args.from(2) : '**Roshan Backup DB**'})
  }
}
