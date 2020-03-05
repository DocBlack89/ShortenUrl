const express = require('express');
const router = express.Router();
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

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('./public'));

router.get('/',  function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
}) 

router.post('/', function (req, res){
    let r = Math.random().toString(36).substr(2, 5) // create random string
    hostname = os.hostname; //get hostname to create url
    date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') //get date to store in DB
    console.log("post request")
    //check if url is not already shorten
    var sql_search = 'SELECT * FROM urls WHERE urls = ?'
    var values_search = [[mysql.escape(req.body.name)]]
    con.query(sql_search, values_search, function (err, result){
        if (err) throw err;
        if (result.length > 0){ //if no, create url 
            console.log("existing url")
            console.log(req.body.name)
            var sql = 'SELECT short FROM urls WHERE urls = ?'
            var values = [[mysql.escape(req.body.name)]];
            con.query(sql, values, function (err, result2, fields) {
                //console.log("query")
                if (err) throw err;
                console.log(result2)
                if ( typeof result2[0] !== 'undefined' && result2 ){
                    console.log(result2[0].short)
                    var redir = (result2[0].short.replace(/['"]+/g, ''));
                    res.send(hostname+"/"+redir)
                    res.end()
                }
            })
            var redir = (result[0].short.replace(/['"]+/g, ''));
            res.send(hostname+"/"+redir)
        } else { //if yes, get existing shorten url
            console.log("no existing url")
            var sql_insert = 'INSERT INTO urls (urls, short, date) VALUES ?';
            var values = [[mysql.escape(req.body.name), mysql.escape(r), date]];
            con.query(sql_insert, [values], function (err, result){
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows)
                return;
            });
            res.send(hostname+"/"+r);
            res.end()
        }
    })
});


router.get('/account', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/account.html'));
}) 

router.get('/signin', function (req, res){
  res.sendFile(path.join(__dirname + '/public/signin.html'));
})

router.get('/:id', function (req, res, next){
    console.log(req.params.id);
    var sql = 'SELECT urls FROM urls WHERE short = ?'
    var values = [[mysql.escape(req.params.id)]];
    con.query(sql, values, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0){
            var redir = (result[0].urls.replace(/['"]+/g, ''));
            res.redirect(301, redir)
            res.end()
        } else {
             res.redirect(301, '/');
             res.end()
	      }
    });
})



module.exports = router;
