const fs = require('fs')

module.exports = class Locale{
  constructor(path,constants,options){
    options = options || {}
    constants = constants || {}
    this.lang = {}
    this.languages = []
    this.constants = constants
    this.defaultLanguage = options.defaultLanguage || 'en'
    this.devLanguage = options.devLanguage || 'en'
    fs.readdirSync(path).forEach(file => {
      const pathfile = `${path}/${file}`
      const lang = file.split('.')[0]
      this.lang[lang] = require(pathfile)
      this.languages.push(lang)
      // this.lang[]
    })
  }
  getString(string,lang){
    lang = lang || this.defaultLanguage
    return this.lang[lang] && this.lang[lang][string] ? this.lang[lang][string] : ''
  }
  getLang(lang){
    return this.lang[lang]
  }
  replaceString(string,lang,replacer){
    let result = this.getRaw(string,lang)
    for(let str in this.constants){
      result = result.replace(new RegExp(`<${str}>`,'g'),this.constants[str]) // Replace
    }
    for(let str in replacer){
      result = result.replace(new RegExp(`<${str}>`,'g'),replacer[str]) // Replace
    }
    return result
  }
  getChannelLang(msg){
    let lang
    if(msg.channel.type === 0){
      const svcached = msg._client.cache.servers.get(msg.channel.guild.id)
      if(svcached){lang = svcached.lang}
    }else{
      const usercached = msg._client.cache.profiles.get(msg.author.id)
      if(usercached){lang = usercached.lang}
    }
    return lang || this.defaultLanguage
  }
  getChannelStrings(msg){
    return this.lang[this.getChannelLang(msg)]
  }
  getChannelString(string,msg){
    const lang = this.getChannelLang(msg)
    return this.getString(string,lang)
  }
  getUserLang(msg){
    let lang
    const usercached = msg._client.cache.profiles.get(msg.author.id)
    if(usercached){lang = usercached.lang}
    else if(msg.channel.type === 0){
      const svcached = msg._client.cache.servers.get(msg.channel.guild.id)
      if(svcached){lang = svcached.lang}
    }
    return lang || this.defaultLanguage
  }
  getUserStrings(msg){
    return this.lang[this.getUserLang(msg)]
  }
  getUserString(string,msg){
    const lang = this.getUserLang(msg)
    return this.getString(string,lang)
  }
  getDevLang(){
    return this.devLanguage
  }
  getDevStrings(){
    return this.lang[this.devLanguage]
  }
  getDevString(string){
    return this.getDevStrings()[string]
  }
  get(string,msg){
    if(typeof string === 'string'){
      return this.getRaw(string,this.getLangFromMsg(msg))
    }else if(Array.isArray(string)){
      const lang = this.getLangFromMsg(msg)
      const obj = {}
      string.forEach(s => {obj[s] = this.getRaw(s,lang)})
      return obj
    }
  }
  getCmd(cmd,msg){
    const lang = this.getUserLang(msg)
    return {args : this.lang[lang][`cmd_${cmd}_args`] || '', help : this.lang[lang][`cmd_${cmd}_help`] || ''}
  }
  getCat(cat,msg){
    const lang = this.getUserLang(msg)
    return this.lang[lang][`cat_${cat.toLowerCase()}_help`] || ''
  }
  addConstants(constants){
    this.constants = Object.assign(this.constants,constants)
  }
  getChannelFlag(flag){
    return Locale.languageFlags()[typeof flag === 'string' ? flag : this.getChannelLang(flag)]
  }
  getUserFlag(flag){
    return Locale.languageFlags()[typeof flag === 'string' ? flag : this.getUserLang(flag)]
  }
  flags(fn){
    const languageFlags = Locale.languageFlags()
    const array = this.languages.map(lang => ({lang, flag : languageFlags[lang]}))
    return fn ? array.map(fn) : array
  }
  stringLocale(string){
    return new StringLocale(string,this.constants)
  }
  replacer(string,obj,lang){
    // console.log('STR', string)
    lang = lang || this.defaultLanguage
    const reg = /%%([\w\._^%+]+)%%/g
    const injected = []
    let match
    while (match = reg.exec(string)){
      injected.push(match[1])
    }
    injected.forEach(inject => {
      if(this.lang[lang][inject]){
        string = string.replace(new RegExp(`%%${inject}%%`, 'g'), this.lang[lang][inject])
      }
    })
    for(let str in this.constants){
      string = string.replace(new RegExp(`<${str}>`,'g'),this.constants[str]) // Replace
    }
    for(let str in obj){
      string = string.replace(new RegExp(`<${str}>`,'g'),obj[str]) // Replace
    }
    return string
  }
  static languageFlags(){
    return {
      es : "🇪🇸",
      en : "🇺🇸"
    }
  }
}
