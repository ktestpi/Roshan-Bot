const { Command } = require('aghanim')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('setlang',{
  category : 'Account', help : 'Estable el idioma de la cuenta', args : '<idioma>'},
  function(msg, args, command){
    return this.components.Account.exists(msg.author.id)
      .then(account => {
        const lang = this.locale.getUserStrings(msg)
        if(!args[1] || !this.locale.languages.includes(args[1].toLowerCase())){
          return msg.reply(this.locale.replacer(lang.langAvaliables,{langs : this.locale.flags(l => `${l.flag} \`${l.lang}\``).join(', ')}))
        }
        return this.components.Account.modify(account._id, { lang: args[1].toLowerCase() })
          .then(() => msg.addReaction(this.config.emojis.default.accept))
      })
  })
