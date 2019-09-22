const xlsx = require('xlsx')

const file = xlsx.readFile('locale.xlsx')

console.log(xlsx.utils.sheet_to_json(file.Sheets.locale))
