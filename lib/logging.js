"use strict"

const Logger = require('express-bunyan-logger')

const logger = Logger({
    name: 'Image annotation',
    streams: [{
        level: 'info',
        stream: process.stdout
    }]
})

module.exports = {
    logger
}