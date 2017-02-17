"use strict"
const configuration = require('./lib/configuration');
const logging = require('./lib/logging');
var Server = require('./lib/Server');

const server = new Server(configuration, logging)

server.listen(configuration.server.public_port, () => {
    console.log(`Server running on ${configuration.server.public_url}, internal port ${configuration.server.public_port}`)
})