const { Markdown } = require('erisjs-utils')
const links = require('../../containers/links.json')

module.exports = {
  name: 'links',
  category: 'General',
  help: 'Enlaces interesantes sobre el juego',
  args: '<categoría>',
  run: async function (msg, args, client, command){
    const query = args.after
    if (!links[query]) { msg.reply('wrongCmdArg', { options: Object.keys(links).join(', '), cmd: args.until(1) })}
    let textLinks = '';
    let textFields = [];
    let arrayFields = links[query].fields.reverse();
    for(let i =  arrayFields.length - 1; i > -1 ; i--) {
      textFields[i] = {
        name : arrayFields[i].name,
        value : '',
        inline : arrayFields[i].inline
      };
      var arrayLinks = arrayFields[i].links.reverse();
      for (let j = arrayLinks.length - 1; j > -1; j--) {
        if(arrayLinks[j].hide){
          textFields[i].value += Markdown.link(arrayLinks[j].link,arrayLinks[j].name) + '\n';
        }else{
          textFields[i].value += Markdown.link(arrayLinks[j].link,arrayLinks[j].name,'embed+link') + '\n';
        }
      }
    };
    return msg.reply({
      embed : {
        title : links[query].title,
        description : links[query].description,
        fields : textFields.reverse(),
        thumbnail : {
          url : links[query].thumbnail  || config.bot.icon,
          height : 40,
          width : 40
        },
        footer : {
          text : links[query].footer.text,
          icon_url : links[query].footer.icon || client.user.avatarURL
        },
        color : client.config.color
      }
    })
  }
}
