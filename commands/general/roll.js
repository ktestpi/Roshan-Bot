const { Command } = require('aghanim')

module.exports = new Command('roll',{
  category : 'General', help : 'Rollea entre dos números', args : '[min/max] [max]'},
  async function (msg, args, client, command){
    let min, max, random;
    if(args.length == 1){
      min = 1;
      max = 6;
      random = Math.floor((Math.random() * max) + 1);
    }else if(args.length == 2){
      args[1] = parseInt(args[1]);
      if(typeof args[1] !== 'number' || isNaN(args[1])){return}
      min = 1;
      max = args[1];
      if(min > max){return};
      random = Math.floor((Math.random() * max) + 1);
    }else if(args.length == 3){
      args[1] = parseInt(args[1]);
      args[2] = parseInt(args[2]);
      if(typeof args[1] !== 'number' || isNaN(args[1]) || typeof args[2] !== 'number' || isNaN(args[2])){return};
      min = args[1];
      max = args[2];
      if(min > max){return};
      random = Math.round(Math.random()*(max - min) + min);
    }
    return msg.reply('roll.text', {min,max, username : msg.author.username,random})
  })
