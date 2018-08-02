// *************************** STEAM MODULE **********************
const util = {};
util.steam = {};
const steamlinks = {profiles : 'http://steamcommunity.com/profiles/', id : 'http://steamcommunity.com/id/'}

util.steam.idToUrl = function(id){
  return (id.match(new RegExp('[^0-9]')) ? steamlinks.id : steamlinks.profiles) + id
}

util.steam.idToLink = function(id,hide,text){
  return hide ? `[${text ? text : id}](${util.steam.idToUrl(id)})` : `[${text ? text : id}](${util.steam.idToUrl(id)}) \`${util.steam.idToUrl(id)}\``
}

util.steam.idToSteamID = function(id32){

  const cv64 = '76561197960265728';
  id32 = util.number.zerofication(id32,cv64.length);
  //console.log('cv64length',cv64.length,id32.length);
  var result = [];
  var carry = 0;
  var sum1,sum2 = 0;
  var sump = 0

  for (var i = cv64.length - 1 ; i >= 0; i--) {
    sum1 = parseInt(id32[i]) || 0;
    sum2 = parseInt(cv64[i]);
    sump = sum1 + sum2 + carry
    if(sump > 9){carry = 1;sump -= 10}else{carry = 0}
    result[i] = sump
    //console.log(`${sum1} + ${sum2} = ${parseInt(sum1)+parseInt(sum2)} / ${result[i]}  con carry ${carry}`);
  }
  var total = result.join('')
  //console.log('Total: ' + total)
  return total
  /*for (var i = id64.length - 1 ; i > 0; i--) {
    console.log(i + ':' + id64[i]);
  }*/
}

util.steam.idToDotaID = function(id64){
  const cv64 = '76561197960265728';
  //id64 = id64.toString()
  var result = [];
  var carry = 0;
  var min,sus = 0;
  for (var i = id64.length - 1 ; i > 0; i--) {
    min = parseInt(id64[i]);
    sus = parseInt(cv64[i]);
    sus = sus + carry;
    if(min < sus){carry = 1;min = 10+min}else{carry = 0};
    if(sus == 0){carry = 1};
    result[i] = min - sus;
    //console.log(min,sus,result[i],carry);
  }
  var total = parseInt(result.join('')).toString();
  //console.log('Total: ' + total)
  return total
  /*for (var i = id64.length - 1 ; i > 0; i--) {
    console.log(i + ':' + id64[i]);
  }*/
}

// *************************** DOTA MODULE **********************

util.dota = {};
const dotalinks = {dotabuff : 'https://www.dotabuff.com/players/', opendota : 'https://www.opendota.com/players/'}

util.dota.idToUrl = function(id,mode){
  return (dotalinks[mode] ? dotalinks[mode] : '') + id
}

util.dota.idToLink = function(id,hide,text,mode){
  mode = mode || 'dotabuff'
  return hide ? `[${text ? text : id}](${util.dota.idToUrl(id,mode)})` : `[${text ? text : id}](${util.dota.idToUrl(id,mode)}) \`${util.dota.idToUrl(id,mode)}\``
}

module.exports = util
