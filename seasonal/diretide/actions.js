module.exports.getCacheUser = function(user){
  return this.cache.users.get(user)
}

module.exports.getCacheUserFromMsg = function(msg){
  return this.actions.getCacheUser(msg.author.id)
}

module.exports.getCacheUserMentioned = function(msg){
  return msg.mentions && msg.mentions.length ?  this.actions.getUser(msg.mentions[0].id) : false
}

module.exports.getUserMentioned = function(msg,id){
  return msg.channel.guild ? msg.channel.guild.members.get(id) : null
}

module.exports.intervalRandomNumber = function(array){
  const [min,max] = array
  return Math.floor(Math.random()*(max-min)) + min
}

module.exports.intervalRandomNumberLimited = function(array,limit){
  const value = this.actions.intervalRandomNumber(array)
  return value > limit ? limit : value
}

module.exports.chanceSuccess = function(chance){
  return Math.random() < chance
}
module.exports.reqUserActiveOwnTeam = function(user,team){
  return user.team === team._id
}

module.exports.reqMoreEqualThan = function(value,req){
  return value > req - 1
}

module.exports.reqUserCheck = function(user,requirements){
    return Object.keys(requirements).reduce((pass, key) => {
      if(!pass){return false}
      const requirement = requirements[key]
      const value = user[key]
      return this.actions.reqMoreEqualThan(value,requirement)
    },true)
}

module.exports.reqUserShow = function(requirements){
  return 'Requirements: ' + Object.keys(requirements).map(key => `${this.config.emojis[key]}: ${requirements[key]}`).join(', ')
}

module.exports.reqCheckTime = function(time){
    return now() - time
}

module.exports.requirementsUser = function(requirements){
  return keys(requirements).reduce((cost,key) => {
    const requirement = requirements[key]
    if(isNumber(requirement)){
      cost[key] = - requirement
    }else if(isArray(requirement)){
      cost[key] = - this.actions.intervalRandomNumber(requirement)
    }else if(isFunction(requirement)){
      cost[key] = - requirement()
    }else{
      cost[key] = this.actions.requirementsUser(requirement)
    }
    return cost
  },{})
}

module.exports.rewardsUser = function(rewards){
  return keys(rewards).reduce((gift,key) => {
    const reward = rewards[key]
    if(isNumber(reward)){
      gift[key] = reward
    }else if(isBoolean(reward)){
      gift[key] = reward
    }else if(isArray(reward)){
      gift[key] = this.actions.intervalRandomNumber(reward)
    }else if(isFunction(reward)){
      gift[key] = reward()
    }else{
      if(isUndefined(reward.notsecure)){gift[key] = this.actions.rewardsUser(rewards[key]);return gift}
      reward.chance = reward.chance || 1
      reward.secure = reward.secure || 0
      if(isNumber(reward.notsecure)){
        if(reward.secure){gift[key] = reward.secure}
        if(reward.chance < 1 && this.actions.chanceSuccess(reward.chance)){gift[key] = (gift[key] || 0) + reward.notsecure}
      }else if(isBoolean(reward.notsecure)){
        if(reward.chance < 1 && this.actions.chanceSuccess(reward.chance)){gift[key] = reward.notsecure}
      }else if(isArray(reward.notsecure)){
        if(reward.secure){gift[key] = reward.secure}
        if(reward.chance < 1 && this.actions.chanceSuccess(reward.chance)){gift[key] = (gift[key] || 0) + this.actions.intervalRandomNumber(reward.notsecure)}
      }
    }
    return gift
  },{})
}

module.exports.totalUserReqRew = function(cached,req,rew){
  const user = deleteProps(cached,'_id')
  return keys(user).reduce((user,key) => {
    if(!isObject(user[key])){
      if(isNumber(user[key])){
        user[key] += (req[key] || 0) + (rew[key] || 0)
      }else if(isBoolean(user[key])){
        user[key] = !isUndefined(rew[key]) ? rew[key] : user[key]
      }
    }else{
      user[key] = this.actions.totalUserReqRew(user[key],req[key] || {}, rew[key] || {})
    }
    return user
  },user)
}

module.exports.calcReqRew = function(user,req,rew){
  const result = {}
  result.requirements = this.actions.requirementsUser(req)
  result.rewards = this.actions.rewardsUser(rew)
  const stats =
  result.total = this.actions.totalUserReqRew(user,result.requirements,result.rewards)
  delete result.total._id
  return result
}

module.exports.showRewards = function(rewards){
  return Object.keys(rewards).sort().filter(key => ['candies','essence','special'].includes(key))
    .map(key => `${this.config.emojis[key]}: ${rewards[key]}`).join(', ')
}

module.exports.newUser = function(id){
  const teamMembers = {
    blue : 0,
    green : 0,
    red : 0,
    yellow : 0
  }
  const teams = this.cache.users.getall().reduce((teams,user) => {
    teams[user.team]++
    return teams
  },teamMembers)

  const team = Object.keys(teams).map(key => ({_id : key, size : teams[key]})).sort((a,b) => a.size - b.size)[0]._id

  return this.actions.resetUser(id,team)
}

module.exports.resetUser = function(id,team){
  const initialUser = {
    candies : 0,
    essence : 0,
    xp : 0,
    stats : {
      defense : 0,
      farm : 0,
      send : 0,
      steal : 0,
      sugar : 0
    },
    team
  }
  return this.cache.users.save(id,initialUser).then()
}

module.exports.resetTeam = function(id){
  if(Object.keys(!this.config.teams).includes(id)){return}
  const initialTeam = {
    candies : 100,
    stats : {
      defense : 0,
      steal : 0,
      send : 0
    },
    ts : {
      steal : 0
    }
  }
  return this.cache.teams.save(id,initialTeam)
}

module.exports.resetGame = function(bot){
  const teams = Object.keys(this.config.teams)
  return Promise.all(teams.map(team => this.actions.resetTeam(team))).then(() => {
    return Promise.all(bot.users.filter(user => !user.bot).map((user,index) => {
      return this.actions.resetUser(user.id,teams[index%4])
    }))
  })
}

module.exports.getCacheTeamMentioned = function(args,pos){
  const team = args[pos]
  if(typeof team !== 'string'){return false}
  return this.cache.teams.get(team.toLowerCase())
}


module.exports.getCachedUserColor = function(user){
  return this.config.teams[user.team].color || 0
}

module.exports.userEmbed = function(user,embed){
  embed.color = this.actions.getCachedUserColor(user)
  return {embed}
}

module.exports.retryCommand = function(bot,msg,args,command){
  return this.actions.newUser(msg.author.id || msg).then(() => command.process.call(bot,msg,args,command))
}

module.exports.retryCommandWithError = function(bot,msg,args,command){
  return this.actions.retryCommand(bot,msg,args,command).then(() => command.error())
}

module.exports.nowToTimestamp = function(time){
    return now() + (time || 0)
}

module.exports.secondsToHms = function(seconds){
  return secondsToHms(seconds)
}

function isNumber(value){return typeof value === 'number' ? true : false}
function isArray(value){return Array.isArray(value) ? true : false}
function isBoolean(value){return typeof value === 'boolean' ? true : false}
function isUndefined(value){return typeof value === 'undefined' ? true : false}
function isFunction(value){return typeof value === 'function' ? true : false}
function isObject(value){return typeof value === 'object' ? true : false}
function now(){return Math.round((new Date()).getTime()/1000)}
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}
function keys(obj){return Object.keys(obj)}
function deleteProps(obj,props){
  props = isArray(props) ? props : [props]
  return keys(obj).reduce((newobj, key) => {
    if(!props.includes(key)){newobj[key] = obj[key]}
    return newobj
  },{})
}
