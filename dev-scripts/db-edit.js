const {firebase, db} = require('./firebase.js')
const { Request } = require('erisjs-utils')

// db.child('profiles').once('value').then(snap => {
//   if(snap.exists()){
//     const profiles = snap.val()
//     Object.keys(profiles).forEach(p => {
//       const profile = profiles[p]
//       console.log(profile.lang);
//       // db.child(`profiles/${p}`).update({lang : 'es'}).then(() => console.log('Updated',p))
//     })
//   }
// })

// db.child('servers').once('value').then(snap => {
//   if(snap.exists()){
//     const servers = snap.val()
//     Object.keys(servers).forEach(s => {
//       const server = servers[s]
//       console.log(server.lang);
//       // db.child(`servers/${s}`).update({lang : 'es'}).then(() => console.log('Updated',s))
//     })
//   }
// })

db.child('profiles').once('value').then(snap => {
  if(snap.exists()){
    const data = snap.val()
    const profiles = Object.keys(data).map(player => ({discordID : player, dotaID : data[player].profile.dota}))
    // const profiles = [{ discordID: "189996884322942976", dotaID: "112840925"}]
    // console.log(profiles)
    requestTs(profiles).then(() => {console.log('Updated profiles')})
  }
})

const requestTs = function(profiles){
  return profiles.reduce((promise, player) => {
    return promise.then(results => new Promise(res => {
      setTimeout(() => Request.getJSON(`https://api.opendota.com/api/players/${player.dotaID}`).then(data => {
        console.log(`Requequest for ${player.discordID}`)
        // console.log(data)
        db.child(`profiles/${player.discordID}`).update({ dota: player.dotaID, steam: data.profile.steamid})
        res([])
      }), 1500)
    }))
  }, Promise.resolve([]))
}

// const profiles = [{ discordID: "189996884322942976", dotaID: "112840925" }]
// requestTs(profiles).then(() => { console.log('Updated profiles') })