const replacer = require('erisjs-utils/discordtext/replacer_ml')

const languages = {
  es : {
    hi : 'hola <player> <name>',
    bye : 'hasta luego <player> <name>'
  },
  en : {
    hi : 'hi <player> <name>',
    bye : 'bye <player> <name>'
  }
}

const keywords = {
  player : 'jugador'
}

const repl = new replacer(languages,keywords,{arrow : ['<','>'], defaultLang : 'en'})

console.log(repl.keywords);
console.log(repl.do('en','hi',{['<name>'] : 'Toni'}));
