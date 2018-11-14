function sortTourneys(a, b) {
    if (a.start && b.start) {
        return b.start - a.start
    } else if (a.start) {
        return -1
    } else if (b.start) {
        return 1
    } else {
        if (a.until && b.until) {
            return b.until - a.until
        } else if (a.until) {
            return -1
        } else if (b.until) {
            return 1
        } else {
            return sortBy('alpha', 'd', '_d')(a, b);
        }
    }
}
function sortBy(by = 'alpha', mode = 'd', param = '_id') {
    switch (by) {
        case 'alpha':
            return sortAlpha(v => v[param].toLowerCase(), mode)
        case 'number':
            return sortAlpha(v => parseInt(v[param]), mode)
        default:
    }
}
function sortAlpha(callback, mode) {
    mode = mode === 'd' ? 'd' : 'a'
    return function (a, b) {
        a = callback(a)
        b = callback(b)
        if (mode === 'a') {
            if (a < b) { return -1 } else if (a > b) { return 1 } else { return 0 }
        } else {
            if (a < b) { return 1 } else if (a > b) { return -1 } else { return 0 }
        }
    }
}

module.exports = { sortTourneys, sortBy, sortAlpha}