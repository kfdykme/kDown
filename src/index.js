const http = require("http")
const fs = require('fs')
import KDown from './KDown.js'



/**
 * @method onReady
 * @param {object} data
 */
 function onReady(data,response){



    response.writeHead(200,{'Context-Type':'text/html'})
    response.write()
    response.end()
}






http.createServer((req,res)=>{
    fs.readFile("./test.md","utf-8",(err,data)=>{
        if(err)throw err

        var kdown =  new KDown(data)
        fs.readFile("./kdown.css","utf-8",(err,data)=>{
            if(err)throw err

            kdown.setStyle(data)

            res.writeHead(200,{'Context-Type':'text/html'})
            res.write(kdown.build())
            res.end()
        })
    })
}).listen(8081)
