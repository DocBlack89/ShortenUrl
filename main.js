const express = require('express')
const app = express()
var path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
var mysql = require('mysql');
const os = require('os')


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "--",
    database: "shorten"
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(bodyParser.urlencoded({ extended: true }));

/* app.get('/shorter', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
}) */

app.post('/', function (req, res){
    let r = Math.random().toString(36).substr(2, 5)
    hostname = os.hostname;
    res.send(hostname+"/"+r);
    date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    var sql = "INSERT INTO urls (urls, short, date) VALUES ?";
    var values = [[req.body.url, r, date]];
    con.query(sql, [values], function (err, result){
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows)
        return;
    });
});

app.get('/:id', function (req, res, next){
    if (req.params.id === 'shorter'){
        res.sendFile(path.join(__dirname + '/index.html'));
    } else {
        console.log(req.params.id);
        var sql = "SELECT urls FROM urls WHERE short = "+ mysql.escape(req.params.id);
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            if ( typeof result[0] !== 'undefined' && result ){
                res.redirect(301, result[0].urls)
            }
            //console.log(result);
            //console.log(result[0].urls)
        });
    }

    
    
})

app.listen(80, function () {
  console.log('Example app listening on port 3000!')
})




//mysql localhost:3306