const path = require('path')
const glob = require('glob')
const gameconfig = require('../duel.config.js')
const { randomInRange } = require('../duel.util.js')

class HandBoard{
    constructor(){
        this.actions_limit = 4
        this.items_limit = 2
        this.actions = []
        this.items = []
        this.reset()
    }
    draw(){
        this.generate('action')
        this.generate('item')
    }
    remove(card){
        let index = this.actions.indexOf(card)
        if(index > -1){this.actions.splice(index,1); return}
        index = this.items.indexOf(card)
        if (index > -1) { this.items.splice(index, 1) }
    }
    generate(type){
        type += 's'
        if (this[type].length < this[type +'_limit']){
            const random = randomInRange(0, HandBoard.pool[type].length)
            const card = HandBoard.pool[type][random]
            this[type].push(card())
        }
    }
    render(skill){
        return { name: 'Shared Hand - Actions', value: `${this.playerActions.filter(el => el).map(playerAction => playerAction.action.render(playerAction.button)).join('\n')}\n${skill}`, inline: false}
    }
    get playerActions(){
        const actions = this.actions.map((action, index) => ({button: gameconfig.board.buttons[index+1], action }))
        while (actions.length < this.actions_limit){
            actions.push(null)
        }
        const items = this.items.map((action, index) => ({ button: gameconfig.board.buttons[index+1+4], action }))
        while (items.length < this.items_limit) {
            items.push(null)
        }
        return [...actions, ...items]
    }
    reset(){
        this.forceDraw('item','cuirass')
        // this.generate('action')
        // this.generate('item')
    }
    forceDraw(type, card){
        if(type === 'action'){
            this[type + 's'].push(loadAction(card)())
        } else if (type === 'item'){
            this[type + 's'].push(loadItem(card)())
        }
    }
}

// HandBoard.pool = {
//     actions: [
//         {
//             name: 'actioncard1', mana: 2, render(index) { return `${index + 1}: ${this.name}` }, can(s, t, b) { const can = s.mana >= this.mana; if (can) { s.consumeMana(this.mana) } else { s.createNotification('not enough mana') }; return can },
//             run(s, t, b) {
//                 s.hero.modifiers.push({ affect: ['hero'], hp: 1, atk: 1, rst: 1, bounty: 1 })
//                 s.createNotification('played actioncard1: Hero gets +1/+1/+1')
//             }
//         },
//         { name: 'actioncard2', render(index) { return `${index + 1}: ${this.name}` }, can(s, t, b) { return true }, run(s, t, b) { } }
//     ],
//     items : [
//         { name: 'item1', render(index) { return `${index + 1}: ${this.name}` }, can(s, t, b) { return true }, run(s, t, b) { } },
//         { name: 'item1', render(index) { return `${index + 1}: ${this.name}` }, can(s, t, b) { return true }, run(s, t, b) { } }    
//     ]
// }

function loadCards(dirname){
    const pattern = `${dirname}/*.js`
    const filenames = glob.sync(pattern)
    return filenames.map(filename => require(filename))
}

function loadAction(action) {
    return require(path.join(__dirname, '../cards/actions')+ '/' + action + '.js')
}
function loadItem(item) {
    return require(path.join(__dirname, '../cards/items') + '/' + item + '.js')
}

HandBoard.pool = {
    actions: loadCards(path.join(__dirname,'../cards/actions')),
    items: loadCards(path.join(__dirname, '../cards/items'))
}

module.exports = HandBoard