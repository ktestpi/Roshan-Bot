const { Command } = require('aghanim')

const modes = ['e','g','l']

module.exports = new Command('tournament',{
  category : 'General', help : 'Sorteo inicial para torneos', args : '<modo: e,l,g[número grupos]> <opciones separadas por ,>'},
  async function(msg, args, client){
    // if(!args[2]){util.fn.wrongCmd(msg,modes,{cmd : config.cmds.tournament.cmd,premsg : '__Comandos disponibles__\n\n',cmdprefix : config.prefix,charslimit : 500,dm : true});return};
    if(!args[1]){return}
    const mode = args[1].slice(0,1);
    // console.log('MODE',mode);
    if(modes.indexOf(mode) == -1){return msg.reply('tournament.error.modes')}
    const message = args.slice(2).join('')
    // console.log('MESSAGE',message);
    const list = message.split(',')
    for (var i = list.length - 1; i > -1 ; i--) {
      if(list[i].length < 1){list.splice(i,1);}
    }
    if(mode == 'l' && list.length < 2){return msg.reply('tournament.error.minelements')}
    const limit = 4;
    if(['e','g'].indexOf(mode) == -1 && list.length < limit){return msg.reply('tournament.error.limitelements',{limit})};
    if(mode == 'e'){
      var result = [];
      for (var i = list.length - 1; i > -1 ; i--) {
        var random = Math.floor(Math.random()*list.length);
        result[i] = list[random];
        list.splice(random,1);
      }
      var fields = [];
      fields[0] = {name : args.user.langstring('tournament.matches'), value : '', inline : false};
      for (var i = 0; i < result.length; i += 2) {
        if(result[i+1]){fields[0].value += '**' + result[i] + '** :crossed_swords:  **' + result[i+1] + '**\n';
        }else{fields[0].value += '**' + result[i] + '** :arrow_forward: \n'};
      }
    }else if(mode == 'g'){
      var numberGroups = parseInt(args[1].slice(1));
      if(args[1].slice(1) == ''){numberGroups = 2};
      if(typeof numberGroups !== 'number' || isNaN(numberGroups)){return msg.reply('tournament.error.groupsnum')}
      if (list.length < numberGroups * 2) { return msg.reply('tournament.error.groupsnumhigh')}
      var groups = [];
      for (var i = 0; i < numberGroups; i++) {
        groups[i] = [];
      };
      var group = 0;
      var element = 0;
      for (var i = list.length - 1; i > -1 ; i--) {
        var random = Math.floor(Math.random()*list.length);
        groups[group][element] = list[random];
        list.splice(random,1);
        group++
        if(group > numberGroups - 1){group = 0; element = groups[0].length}
      }
      for (var i = 0; i < groups.length; i++) {
        groups[i].sort(function(a,b){if(a.toLowerCase()<b.toLowerCase()){return -1}else{return 1}});
      }
      var fields = [];
      for (var i = 0; i < groups.length; i++) {
        fields[i] = {name : args.user.langstring('tournament.group') + ' ' + (i+1), value : '', inline : true};
        for (var j = 0; j < groups[i].length; j++) {
          fields[i].value += groups[i][j] + '\n';
        }
      }
    }if(mode == 'l'){
      var result = [];
      for (var i = list.length - 1; i > -1 ; i--) {
        var random = Math.floor(Math.random()*list.length);
        result[i] = list[random];
        list.splice(random,1);
      }
      var fields = [];
      fields[0] = {name : args.user.langstring('tournament.list'), value : '', inline : false};
      for (var i = 0; i < result.length; i++) {
        fields[0].value += result[i] + ', ';
      }
      fields[0].value = fields[0].value.slice(0,-2);
    }
    return msg.reply({
      embed : {title : args.user.langstring('tournament.tourney') + ' - (' + (msg.author.nick || msg.author.username) + ')', fields : fields, color : client.config.color}
    })
  })

  //TODO: with embedbuilder
