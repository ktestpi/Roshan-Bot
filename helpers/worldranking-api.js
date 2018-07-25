const util = require('erisjs-utils')

const api = {}
api.divisions = ['europe', 'americas', 'china', 'seasia']
api.defaultDivision = api.divisions[0]

api.urls = {
  base : 'http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=',
  americas : 'americas',
  china : 'china',
  seasia : 'se_asia',
  europe : 'europe'
}

api.url = division => api.urls.base + api.urls[division]

api.get = (division) => {
  return new Promise((resolve, reject) => {
    util.request.getJSON(api.url(division)).then(result => {
      resolve(result)
    }).catch(err => reject(err))
  })
}

api.searchPlayerInWorld = (query) => {
  return new Promise((resolve, reject) => {
    api.promises().then(r => {
      const where = r.map((d,i) => {
        const ix = d.leaderboard.findIndex(p => p.name.toLowerCase() === query.toLowerCase())
        if(ix > -1){return {pos : ix + 1 , player : d.leaderboard[ix], division : api.divisions[i]}}
      }).filter(p => p)
      if(where.length){resolve(where)}else{reject(`Player not found with name: ${query}`)}
    }).catch(err => reject(err))
  })
}

api.promises = () => {
  let promises = [];
  for (var i = 0; i < api.divisions.length; i++) {
    promises.push(util.request.getJSON(api.url(api.divisions[i])))
  }
  return Promise.all(promises)
}

module.exports = api
