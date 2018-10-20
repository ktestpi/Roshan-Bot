const fs = require('fs')
const path = __dirname + '/commands'

let locale = {}

function fn(folders){
  folders.forEach(folder => {
    console.log('Entering',path +'/' + folder);
    fs.readdirSync(path +'/' + folder).forEach(file => {
      if(file.slice(-3) !== '.js'){return}
      const cmd = require(path +'/' + folder +'/'+file)
      locale[`cmd_${cmd.subcommandFrom ? cmd.subcommandFrom + '_' : ''}${cmd.name}_args`] = cmd.args
      locale[`cmd_${cmd.subcommandFrom ? cmd.subcommandFrom + '_' : ''}${cmd.name}_help`] = cmd.help
    })
  })
}

fn(['account','artifact','bot','card','dota2','fun','general','opendota','server'])

fs.writeFile('./dev-scripts/localscript.json', JSON.stringify(locale), (err) => {
  console.log(err);
})
