// Writes build-info.js with the UTC ISO timestamp for the current deploy/build.
const fs = require('fs')
const path = require('path')

const iso = new Date().toISOString()
const file = path.join(__dirname, '..', 'build-info.js')
const body = `// Generated at build/deploy time. Do not edit by hand.
const BUILD_TIMESTAMP_ISO = '${iso}'
`
fs.writeFileSync(file, body)
console.log('Wrote build-info.js', iso)
