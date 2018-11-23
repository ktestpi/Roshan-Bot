const fs = require('fs')
const path = require('path')
const jimp = require('jimp')

const cwd = process.cwd()
const entry = process.argv[2]
const output = process.argv[3]
if (!entry || !output){ throw new Error('No entry/output')}

const src = path.join(cwd, entry)
const dest = path.join(cwd, output)

const files = fs.readdirSync(src)
files.forEach((file,index) => {
    const filename = path.basename(file, '.png')
    console.log(path.join(src, file))
    console.log(path.join(dest, file))
    jimp.read(path.join(src,file)).then(data => data.quality(100).write(path.join(dest,`${filename}.jpg`)))
})

// filenames.forEach(f => {
//   const basename = path.basename(f);
//   // console.log(basename);
//   jimp.read(f).then(data => data.resize(jimp.AUTO,24).quality(100).write(PATH_RESULT + '/' + basename))
// })