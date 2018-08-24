module.exports = {
    logRed: (text) => console.log('\x1b[31m%s\x1b[1m\x1b[0m', text),
    logGreen: (text) => console.log('\x1b[32m%s\x1b[1m\x1b[0m', text),
    logYellow: (text) => console.log('\x1b[33m%s\x1b[1m\x1b[0m', text),
}