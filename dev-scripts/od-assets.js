const fs = require('fs')
const path = require('path')
const jimp = require('jimp')
const { hero_names, items } = require('dotaconstants')
const cwd = process.cwd()
// const entry = process.argv[2]
const APIURL = 'https://api.opendota.com'
const folderHeroes = 'heroes'
const foldeMiniHeroes = 'miniheroes'
const folderItems = 'items'

const downloadAll = process.argv.includes('-all')
const destination = process.argv[2] || 'assets'
const timeWaitPromises = 4

function main(){
    console.log('Config')
    console.log('Destination:',destination)
    console.log('DownloadAll:',downloadAll)
    console.log('---------------------------')
    const assets = []
    const heroesOwned = assestsOwned(path.join(destination, folderHeroes))
    const miniHeroresOwned = assestsOwned(path.join(destination, foldeMiniHeroes))
    const itemsOwned = assestsOwned(path.join(destination, folderItems))
    // console.log(heroesOwned)
    // console.log(itemsOwned)
    assets.push(...Object.keys(hero_names).map(heroName => {
        const url = `${APIURL}${hero_names[heroName].img}`
        return { filename: path.basename(url).replace(/\?/g, '').replace('_full', ''), url, dest: path.join(destination, folderHeroes) }
    }).filter(filterDownload(heroesOwned)))

    assets.push(...Object.keys(hero_names).map(heroName => {
        const url = `${APIURL}${hero_names[heroName].icon}`
        return { filename: path.basename(url).replace('_icon', ''), url, dest: path.join(destination, foldeMiniHeroes) }
    }).filter(filterDownload(miniHeroresOwned)))
    
    assets.push(...Object.keys(items).map(item => {
        const url = `${APIURL}${items[item].img}`
        return { filename: path.basename(url).replace(/\?3/g, '').replace('_lg', ''), url, dest: path.join(destination, folderItems) }
    }).filter(filterDownload(itemsOwned)))
    
    if(assets.length > 0){
        console.log(`>> ${assets.length} assets found`)
        console.log('---------------------------')
        reducePromiseTemp(timeWaitPromises)(assets).then((results) => {
            const message = !results.fail.length ? '' : `with ${results.fail.length} errors\n${results.fail.map(f => `<${f.filename}> to [${f.dest}] in |<${f.url}>|`).join('\n')}`
            console.log(`>> Download Finished!${message}`)
            process.exit()
        })
    }else{
        console.log('Assets is up to date!')
    }
}

function downloadAsset(dest){
    return function({filename, url},index){
        const destPath = path.join(cwd,dest)
        console.log('Filename:', filename)
        console.log('To:', destPath)
        console.log('URL:', url)
        return jimp.read(url)
            .then(data => data.quality(100)
            .write(path.join(destPath, filename)))
            .then(() => console.log('Downloaded:',path.join(dest,filename)))
            .catch(err => console.log('ERROR in',url,err))
    }
}

function reducePromiseTemp(time){
    return function(array){
        return array.reduce((promise, { filename, url , dest }) => {
            console.log('Promise',typeof promise,promise)
            return promise.then(results => 
                new Promise(res => {
                    setTimeout(() => {
                        const destPath = path.join(cwd, dest)
                        console.log(`Filename: <${filename}> to [${destPath}] in |${url}|`)
                        // res({ success: [], fail: [] })
                        // console.log('Results',results)
                        jimp.read(url)
                            .then(data => data.quality(100).write(path.join(destPath, filename)))
                            .then(() => { console.log('-> Downloaded:', path.join(dest, filename)); results.success.push({ dest, filename, url }); res(results)})
                            .catch(err => { console.log('ERROR in', url, err); results.fail.push({ dest, filename, url }); res(results)})
                    }, time * 1000)
                }))
            }, Promise.resolve({success : [], fail : []}))
    }
}

function assestsOwned(dir){
    return fs.readdirSync(path.join(cwd, dir))
}

function filterDownload(files){
    return function(item,index){
        return downloadAll ? true : !files.includes(item.filename)
    }
}

main()
// .reduce((promise, player) => {
//     return promise.then(results => new Promise(res => {
//         console.log(`Update leaderboard to ${player.dota_id}`)
//         setTimeout(() => this.client.components.Opendota.player_steam(player.dota_id).then(dataArray => {
//             const [data] = dataArray;
//             player.data = data; res([...results, player])
//         }), 2000)
//     }))
// }, Promise.resolve([]))
// const files = fs.readdirSync(src)
// files.forEach((file, index) => {
//     const filename = path.basename(file, '.png')
//     console.log(path.join(src, file))
//     console.log(path.join(dest, file))
//     jimp.read(path.join(src, file)).then(data => data.quality(100).write(path.join(dest, `${filename}.jpg`)))
// })