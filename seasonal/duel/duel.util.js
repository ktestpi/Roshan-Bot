const glob = require('glob')

module.exports.randomInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

module.exports.jsFilesOnDirectory = function (dirname) {
    const pattern = `${dirname}/*.js`
    const filenames = glob.sync(pattern)
    return filenames
}

module.exports.loadJsFilesOnDirectory = function (dirname) {
    const pattern = `${dirname}/*.js`
    const filenames = glob.sync(pattern)
    return filenames.map(filename => require(filename))
}

module.exports.delay = function(time) {
    return new Promise((res, rej) => {
        setTimeout(() => res(), time)
    })
}

module.exports.deleteMessageAfterTime = function (time) {
    return m => module.exports.delay(time).then(() => m.delete())
}
