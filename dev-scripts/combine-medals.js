const jimp = require('jimp')
const path = require('path')
const glob = require('glob')
const fs = require('fs')

// Constants
const ROOTPATH = './img/medals/combine'
const STARSPATH = 'stars'
const BASEPATH = 'base'
const PREFIXMEDAL = process.argv[2] || ''

console.log('Prefix Medal:', PREFIXMEDAL)

const rootpath = (...p) => path.join(ROOTPATH,...p)

const combineImages = function(basepath, starspath){
    return Promise.all([
        jimp.read(basepath),
        jimp.read(starspath)
    ]
    ).then(([base, stars]) => {
        base.composite(stars,0,0)
        return new Promise((res, rej) => {
            // this.base.getBuffer(jimp.MIME_JPEG,function(err,buffer){resolve(buffer)})
            base.getBuffer(jimp.MIME_PNG /*format === 'png' ? jimp.MIME_PNG : jimp.MIME_JPEG*/,
                (err, buffer) => !err ? res(buffer) : rej(err)
            )
        })
    })
}

const cleanFilename = filename => path.basename(filename).replace('.png','').replace('rank_star_','')

console.log(rootpath(BASEPATH) + '/*.png')
const bases = glob.sync(rootpath(BASEPATH + '/*.png') )
const stars = glob.sync(rootpath(STARSPATH + '/*.png'))

console.log(bases,stars)
bases.forEach(base => {
    stars.forEach(star => {
        const filename = PREFIXMEDAL + cleanFilename(base) + '_' + cleanFilename(star) + '.png'
        // return;
        combineImages(base, star).then(buffer => fs.writeFile(rootpath('output/' + filename), buffer, (err) => {
            console.log( err ? `Error occured on cb ${filename} ${err}` : `${filename} saved!`)
        })).catch(err => console.log(`Error occured on buff ${filename}`,err))
    })
})
