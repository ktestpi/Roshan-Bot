const RoshanGame = require('../../classes/game.js')
const StatusFirebase = require('./classes/status.js')

const dirname = __dirname
const Diretide = new RoshanGame('Diretide','Diretide',{
    description : 'Welcome to Diretide Game',
    roshan : {
      color : 0x940e0a
    },
    autostart : true, // autoincia ciclo evento si true
    emojis : {
      candies : '<:greeviltaffy:504819678712168458>',
      essence : '<:essence:504819678980341760>',
      xp : '<:xp:504819679114821642>',
      protect : ':shield:'
    },
    guide : {
      description : `The most ominous event of Diretide is the annual suspension of Roshan's enchantment. He leaves of his pit in search of the one food that can satisfy his infernal craving: Greevil Taffy!`,
      objective : `Collect Greevil Taffy <:greeviltaffy:504819678712168458> and send it to your team basket. Win team with most of them.\n\n*Note: you can see Roshan mode as Discord Mode.*`,
      note : `Avaliable until 4th November`,
      moreInfo : 'More info : `r!diretide`',
      actions : [
        {cmd : 'defense', text : 'Add time to protect your team basket'},
        {cmd : 'farm', text : 'Farm candies and essences'},
        {cmd : 'send', text : 'Send candies to your team basket'},
        {cmd : 'steal', text : 'Steal candies from enemy team basket'},
        {cmd : 'sugar', text : 'Attack to Roshan when he is SugarRush mode'},
      ],
      info_actions : [
        {cmd : 'bag', text : 'See your bag and stats'},
        {cmd : 'roshan', text : 'See Roshan status'},
        {cmd : 'teams', text : 'See teams status'}
      ],
      thumbnail : "https://articles-images.sftcdn.net/wp-content/uploads/sites/2/2013/11/diretide_fb_image.jpg"
    },
    teams : {
      blue : {
        color : 0x0000FF
      },
      green : {
        color : 0x00FF00
      },
      red : {
        color : 0xFF0000
      },
      yellow : {
        color : 0x2bb403
      }
    },
    logChannel : '504825892099457037', //504825892099457037 alphatest => 327603261085581312
    events : {
      active : {
        require : {
          essence : 1
        },
        rewards : {
          candies : [10,15],
          xp : 1
        }
      },
      exhausted : {
        duration : 0.25
      },
      sugarrush : {
        emoji : '<:sugarrush:504819683342680075>',
        duration : 15, // minutes
        randomFirstStart : [1,3], // hours
        randomStart : [3,5], // hours
        require : {
          essence : 1
        },
        rewards : {
          candies : [15,20],
          xp : 1
        }
      }
    },
    setup : {
      defense : {
        emoji : ':shield:',
        ts : {
          team : 60
        },
        require : {
          essence : 1
        },
        rewards : {
          xp : 1,
          stats : {
            defense : 1
          }
        }
      },
      farm : {
        emoji : '<:farm:504819675524235265>',
        require : {},
        rewards : {
          candies : [5,7],
          essence : {notsecure : [1,2], chance : 0.40, secure : 2},
          xp : 1
        },
        ts : {
          user : 7200
        }
      },
      send : {
          emoji : '<:send:504819680150814740>',
          require : {},
          rewards : {
            xp : 1
          }
      },
      steal : {
        emoji : '<:steal:504819676828794900>',
        require : {essence : 1},
        rewards : {
          candies : [3,5],
          xp : 1
        },
        ts : {
          team : 30,
          user : 7200
        }
      },
      sugar : {
        emoji : '<:attack:504819667399868426>',
        require : {essence : 1},
        rewards : {
          candies : [15,21]
        }
      }
    }
})

Diretide.addCommandsDir(dirname + '/commands')
Diretide.addEventsDir(dirname + '/events')

Diretide.addActions(require('./actions.js'))

Diretide.status = new StatusFirebase(Diretide,{mode : 0})

module.exports = Diretide
