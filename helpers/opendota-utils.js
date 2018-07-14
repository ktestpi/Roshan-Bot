const victory = require('../lang.json').victory
const defeat = require('../lang.json').defeat
const radiant = require('../lang.json').radiant
const dire = require('../lang.json').dire

module.exports.kda = function(kills,deaths,assists){
  return ((kills + assists)/deaths).toFixed(2)
}

module.exports.winratio = function(wins,loses){
  return ((wins/(wins+loses))*100).toFixed(2)
}

module.exports.winnerTeam = function(table){
  if(table.radiant_win){
    if(table.radiant_team){return table.radiant_team.name}else{return radiant};
  }else{
    if(table.dire_team){return table.dire_team.name}else{return dire};
  }
}

module.exports.winOrLose = function(state,slot){
  if(((parseInt(slot) < 100) &&(state)) || ((parseInt(slot) > 100) &&(!state))){
    return victory; //lang.victory
  }else{
    return defeat; //lang.defeat
  }
}

module.exports.durationTime = function(time){
  time = parseInt(time)
  var m = Math.floor(time/60)
  var s = time%60
  return util.number.zerofication(m) + ':' + util.number.zerofication(s)
}

module.exports.nameOrNick = function(profile){
  const name = profile.name ? profile.name : profile.personaname;
  return parseText(name || unknown,'nf');
}

module.exports.nameAndNick = function(profile){
  const name = profile.name ? profile.personaname + " ("+ profile.name + ")"  : profile.personaname;
  return parseText(name || unknown,'nf')
}

function parseText(text,mode){
  if(typeof text != 'string'){return unknown}
  var newText = text;
  if(mode == 'nf'){
    newText = text.replace(new RegExp('`','g'),'\'')
  }
  return newText
}

module.exports.parseText = parseText

module.exports.getMedal = function(rank,mode,replace){ //DEPRECATED
  if(!rank){return ""};
  let rank_tier = rank.rank_tier, leaderboard = rank.leaderboard_rank || null;
  let medal_tier = rank.rank_tier ? parseInt(rank_tier.toString()[0]) : 0, medal_range = rank.rank_tier ? parseInt(rank_tier.toString()[1]) : 0;
  let medal,medal_raw = {rank : null,leaderboard : null};
  const medals = ["norank","herald", "guardian", "crusader", "archon", "legend", "ancient", "divine","immortal"];
  const topmedals = ['top1000','top100','top10','top1'];
  if(rank_tier < 80){
    if(rank_tier){
      medal = "<medal_" + medals[medal_tier] + "> " + medal_range
    }else{medal = "<medal_" + medals[medal_tier] + ">"}
  }else{
    medal_raw = medal_tier + "" + medal_range + "-" + leaderboard
    if(leaderboard > 1000 || !leaderboard){
      medal = "<medal_" + medals[8] + "> " + (leaderboard ? " (#" + leaderboard + ")" : "")
    }else if(leaderboard <= 1000 && leaderboard > 100){
      medal = "<medal_" + medals[8] + "> " + " (#" + leaderboard + ")"
    }else if(leaderboard <= 100 && leaderboard > 10){
      medal = "<medal_" + medals[8] + "> " + " (#" + leaderboard + ")"
    }else if(leaderboard <= 10){
      medal = "<medal_" + topmedals[2] + "> " + " (#" + leaderboard + ")"
    }else if(leaderboard === 1){
      medal = "<medal_" + topmedals[2] + "> " + " (#" + leaderboard + ")"
    }
  }
  if(mode === 'emoji'){
    return replace.do(medal)
  }else if(mode === 'raw'){
    return {rank : rank.rank_tier || false, leaderboard : rank.leaderboard_rank || false}
  }
  // Herald, Guardian, Crusader, Archon, Legend, Ancient, and Divine
}
