const messages = require('../../containers/messages.json')

const rules = {}
rules['1v1rules'] = messages['1v1rules']
rules['1v1rules nr'] = messages['1v1rules nr']

module.exports = {
  name: '1v1rules',
  category: 'General',
  help: 'Reglas básicas de 1v1',
  args: '[nr]',
  run: async function (msg, args, client, command){
    let query = args[0]
    if(args[1]){query += ' ' + args[1]}
    if (!rules[query]) { return msg.reply('cmd.wrongarg', { options: Object.keys(rules).join(', '), cmd: args.until(1)})}
    return msg.reply(rules[query])
  }
}
