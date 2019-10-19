module.exports = {
  name: 'new',
  category: 'General',
  help: 'Última update',
  args: '',
  run: async function (msg, args, client, command){
    return msg.reply(client.cache.botPatchNotes)
  }
}
