module.exports = {
  name: 'register',
  category : 'Account',
  help : 'Registro en el bot',
  args : '<dotaID>',
  requirements : [
    {
      validate: (msg, args, client, command, req) => {
        args.dotaID = args[1]
        return args.length > 1
      },
      response: (msg, args, client, command, req) => msg.author.locale('register.help')
    },
    {
      validate: (msg, args, client, command, req) => {
        return !msg.author.registered
      },
      responseDM: (msg, args, client, command, req) => msg.author.locale('register.alreadyregistered')
    }
  ],
  run: async function (msg, args, client, command){
    return client.components.Account.createProcess(msg.author.id, args.dotaID, msg)
  }
}
