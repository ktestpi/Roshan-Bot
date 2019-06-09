const xlsx = require('xlsx')

const locale_keys = Object.keys(require('../locale/en')).sort()

const wb = xlsx.utils.book_new()

const langs = ["en", "es"]
const en = require('../locale/en')
const es = require('../locale/es')
/* make worksheet */
var ws_data = [
    ["", ...langs],
    // ["S", "h", "e", "e", "t", "J", "S"],
    // [1, 2, 3, 4, 5]
];

locale_keys.forEach(key => {
    ws_data.push([key, en[key], es[key]])
})

var ws = xlsx.utils.aoa_to_sheet(ws_data);

/* Add the worksheet to the workbook */
xlsx.utils.book_append_sheet(wb, ws, "locale");
xlsx.writeFile(wb, 'locale.xlsx');
