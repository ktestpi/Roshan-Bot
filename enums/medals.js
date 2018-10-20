const MEDAL = {
  "0" : "norank",
  "1" : "herald",
  "2" : "guardian",
  "3" : "crusader",
  "4" : "archon",
  "5" : "legend",
  "6" : "ancient",
  "7" : "divine",
  "8" : "immortal"
}

const TOP = { top1000 : 'top1000', top100 : 'top100', top10 : 'top10', top1 : 'top1'}


module.exports = function({rank,leaderboard}){
  let result = {medal : '', range : '', leaderboard, compose : '', emoji : ''}
  if(rank){
    if(leaderboard){
      switch (true) {
        case leaderboard > 1000:
          result.medal = MEDAL[8]
          break;
        case leaderboard <= 1000 && leaderboard > 100:
          result.medal = TOP.top1000
          break;
        case leaderboard <= 100 && leaderboard > 10:
          result.medal = TOP.top100
          break;
        case leaderboard <= 10 && leaderboard > 1:
          result.medal = TOP.top1000
          break;
        case leaderboard === 1:
          result.medal = TOP.top1
          break;
        default:
          result.medal = MEDAL[8]
      }
    }else{
      result.medal = MEDAL[rank.toString()[0]]
      result.range = rank.toString()[1]
    }
  }else{
    result.medal = MEDAL[0]
  }
  result.compose = result.range ? result.medal + '_' + result.range : result.medal
  // result.emoji = '<medal_' + result.compose + '>'
  result.emoji = '<medal_' + result.medal + '>' + (result.range ? ' ' + result.range : '') + (result.leaderboard ? ' #' + result.leaderboard : '')
  return result
}

module.exports.medal = MEDAL
module.exports.top = TOP
