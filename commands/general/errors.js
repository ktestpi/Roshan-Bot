module.exports = {
  name: 'errors',
  category: 'General',
  help: 'Corrección de errores',
  args: '',
  run: async function (msg, args, client, command){
    return msg.reply({
      embed: {
        title: 'errors.title',
        fields: [
          { name: 'errors.field0.name', value: 'errors.field0.value', inline: false },
          { name: 'errors.field1.name', value: 'errors.field1.value', inline: false }
        ],
        footer: { text: 'about.footer', icon_url: '<bot_icon>' }
      }
    })
  }
}
