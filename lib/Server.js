"use strict"
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const fs = require('fs')

class Server {

    constructor(configuration, logging) {
        this.title = "Image annotation";
        this.fileList = []
        this.app = express();
        this.configureApp(logging, configuration)
        this.configureRoutes()

        const folder = `${__dirname}/../public/dataset/`;
        fs.readdir(folder, (err, files) => {
            files.forEach(file => {
                this.fileList.push(file)
            });
        })
    }

    listen(port, callback) {
        this.app.listen(port, callback);
    }

    configureApp(logging, configuration) {
        this.app.set('views', path.join(__dirname, '..', 'views'))
        this.app.set('view engine', 'hbs')
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.static(path.join(__dirname, '..', 'public')))
        this.app.use(express.static(path.join(__dirname, '..', 'dashboard-theme')))
        //this.app.use(logging.logger)
    }




    configureRoutes() {
        this.app.get('/', (req, res) => {
            fs.readFile(`${__dirname}/../public/dataset/${this.fileList[0]}`, (err, data) => {
                var img = new Buffer(data, 'binary').toString('base64');
                let fileList = this.fileList.slice()
                let firstFile = fileList.shift()
              
                res.render('index', {
                    title: this.title,
                    fileList: fileList,
                    firstFile: firstFile,
                    img:img
                })
            });
        })

        this.app.get('/status', (req, res) => {
            return res.send(200)
        })

        this.app.put('/annotation', (req, res) => {
            const x = req.body.annotations
            console.log(x)
            res.sendStatus(200)
        })

        this.app.get('/image/:id', (req, res) => {
            fs.readFile(`${__dirname}/../public/dataset/${req.params.id}`, (err, data) => {
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                });
                const img = new Buffer(data, 'binary').toString('base64');
                res.end(img);
            });
        })

        this.app.get('/imageList', (req, res) =>{
            res.send(this.fileList)
        })

    }

}

module.exports = Server