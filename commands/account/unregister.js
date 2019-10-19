module.exports = {
  name: 'unregister',
  category : 'Account',
  help : 'Elimina tu cuenta de Roshan',
  args : '',
  requirements: ['account.exist'],
  run: async function (msg, args, client, command){
    return client.components.Account.deleteProcess(args.account._id, msg)
  }
}
