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
    password: "?/qM45J8J^:+",
    database: "shorten"
});




var handleDBDisconnect = function() {
    con.on('error', function(err) {
        if (!err.fatal) {
            return;
        }
        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            console.log("PROTOCOL_CONNECTION_LOST");
            throw err;
        }
        log.error("The database is error:" + err.stack);

        handleDBDisconnect();
    });
   };
handleDBDisconnect();



  
//con.connect(function(err) {
//    if (err) throw err;
//    console.log("Connected!");
//});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
    //res.redirect(301, '/shorter')
    res.sendFile(path.join(__dirname + '/public/index.html'));
}) 

app.post('/', function (req, res){
    let r = Math.random().toString(36).substr(2, 5) // create random string
    hostname = os.hostname; //get hostname to create url
    date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') //get date to store in DB
    console.log("post request")
    //check if url is not already shorten
    var sql_search = 'SELECT * FROM urls WHERE urls = ?'
    var values_search = [[mysql.escape(req.body.url)]]
    con.query(sql_search, values_search, function (err, result){
        if (err) throw err;
        if (result.length > 0){ //if no, create url 
            console.log("existing url")
            console.log(req.body.url)
            var sql = 'SELECT short FROM urls WHERE urls = ?'
            var values = [[mysql.escape(req.body.url)]];
            con.query(sql, values, function (err, result2, fields) {
                //console.log("query")
                if (err) throw err;
                console.log(result2)
                if ( typeof result2[0] !== 'undefined' && result2 ){
                    console.log(result2[0].short)
                    var redir = (result2[0].short.replace(/['"]+/g, ''));
                    res.send(hostname+"/s/"+redir)
                }
            })
            var redir = (result[0].short.replace(/['"]+/g, ''));
            res.send(hostname+"/s/"+redir)
        } else { //if yes, get existing shorten url
            console.log("no existing url")
            var sql_insert = 'INSERT INTO urls (urls, short, date) VALUES ?';
            var values = [[mysql.escape(req.body.url), mysql.escape(r), date]];
            con.query(sql_insert, [values], function (err, result){
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows)
                return;
            });
            res.send(hostname+"/s/"+r);
        }
    })
});


app.get('/s/:id', function (req, res, next){
/*     if (req.params.id === 'shorter'){
        res.sendFile(path.join(__dirname + '/index.html'));
    } else { */
    console.log(req.params.id);
    var sql = 'SELECT urls FROM urls WHERE short = ?'
    var values = [[mysql.escape(req.params.id)]];
    con.query(sql, values, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0){
            var redir = (result[0].urls.replace(/['"]+/g, ''));
            res.redirect(redir)
        } else {
	    res.redirect('/');
	}
        //console.log(result);
        //console.log(result[0].urls)
        if ( result.length > 0){
            var redir = (result[0].urls.replace(/['"]+/g, ''));
            res.redirect(redir)
        } else {
            res.redirect('/');
        }
    });
    //}
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
