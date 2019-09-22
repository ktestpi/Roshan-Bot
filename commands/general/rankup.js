const { Command } = require('aghanim')
const fs = require('fs')
const path = require('path')
const { promisifyCallback } = require('../../helpers/functional.js')

const readFile = promisifyCallback(fs.readFile)

module.exports = new Command('rankup',{
  category : 'General', help : 'Sube de MMR', args : ''},
  async function (msg, args, client, command){
    msg.channel.sendTyping()
    return readFile(path.join(__dirname, '../..', '/img/rankup.png'))
      .then(data => msg.reply('RankUp', {}, {file : data, name :'rankup.png'}))
  })