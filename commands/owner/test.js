const { Command } = require('aghanim')

module.exports = new Command('test',{
  category : 'Owner', help : 'Testing', args : '',
  ownerOnly : true, hide : true},
  async function(msg, args, client){
    // let self = this
    // console.log(this.commands.find(c => c.subcommands.find(cmd => cmd.name === 'card')));
    // console.log(this.listeners('messageCreate').length);
    let promise = new Promise((resolve,reject) => {
      resolve(1)
    }).then(res => new Promise((resolve,reject) => {
      console.log(res);
      bla()
      resolve(2)
    })).then(res => new Promise((resolve,reject) => {
      console.log(res);
      resolve(3)
    })).then(res => console.log('Finish with',res))
    .catch(err => {
      console.log(err.stack);
      client.logger.add('oderror','Error: '+err+'\n```'+err.stack+'```',true)
    })
  })
