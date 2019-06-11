const { Component } = require('aghanim')
const CustomComponent = require('../classes/custom-component.js')
const { Request } = require('erisjs-utils')

module.exports = class WorldRankingApi extends Component{
    constructor(client, options) {
        super(client)
        this.divisions = ['europe', 'americas', 'china', 'seasia']
        this.defaultDivision = this.divisions[0]
        this.urls = {
            base: 'http://www.dota2.com/webapi/ILeaderboard/GetDivisionLeaderboard/v0001?division=',
            americas: 'americas',
            china: 'china',
            seasia: 'se_asia',
            europe: 'europe'
        }
    }
    url(division){
        return this.urls.base + this.urls[division]
    }
    get(division){
        return Request.getJSON(this.url(division))
    }
    searchPlayerInWorld(query){
        return new Promise((resolve, reject) => {
            this.promises().then(r => {
                const where = r.map((d, i) => {
                    const ix = d.leaderboard.findIndex(p => p.name.toLowerCase() === query.toLowerCase())
                    if (ix > -1) { return { pos: ix + 1, player: d.leaderboard[ix], division: this.divisions[i] } }
                }).filter(p => p)
                if (where.length) { resolve(where) } else { reject(`Player not found with name: ${query}`) }
            }).catch(err => reject(err))
        })
    }
    promises(){
        const promises = [];
        for (let i = 0; i < this.divisions.length; i++) {
            promises.push(Request.getJSON(this.url(this.divisions[i])))
        }
        return Promise.all(promises)
    }
}