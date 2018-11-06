const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('setlang',{
  category : 'Account', help : 'Estable el idioma de la cuenta', args : '<idioma>'},
  function(msg, args, command){
    // let self = this
    const profile = this.cache.profiles.get(msg.author.id)
    if(!profile){return basic.needRegister(msg)}
    const lang = this.locale.getUserStrings(msg)
    if(!args[1] || !this.locale.languages.includes(args[1].toLowerCase())){return msg.reply(this.locale.replacer(lang.langAvaliables,{langs : this.locale.flags(l => `${l.flag} \`${l.lang}\``).join(', ')}))}
    this.cache.profiles.modify(profile._id,{lang : args[1].toLowerCase()}).then(() => msg.addReaction(this.config.emojis.default.accept))
  })
