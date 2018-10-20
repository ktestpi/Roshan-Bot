const {firebase, db} = require('./firebase.js')

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

db.child('servers').once('value').then(snap => {
  if(snap.exists()){
    const servers = snap.val()
    Object.keys(servers).forEach(s => {
      const server = servers[s]
      console.log(server.lang);
      // db.child(`servers/${s}`).update({lang : 'es'}).then(() => console.log('Updated',s))
    })
  }
})
