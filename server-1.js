// Grace Biemans geb965
'use strict';

const path = require("path")

const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true}));

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'mysql', 
    port: '3306',
    user: 'root',
    password: 'admin',
});

const PORT = 8000;
const HOST = '0.0.0.0';

const panic = (err) => console.error(err)





connection.connect((err) => {
    if (err) { panic (err) }

    connection.query("CREATE DATABASE IF NOT EXISTS assignment;", (err, result) => {
        if (err) { panic(err) }
    })

    connection.query("USE assignment;", (err, result) => {
        if (err) { panic(err) }
    })

    connection.query("CREATE TABLE IF NOT EXISTS posts (topic VARCHAR(20), data VARCHAR(50), timestamp TIMESTAMP);", (err, result) => {
        if (err) {panic(err) }
    })
});

var checkedRadio;


app.post('/postmessage', (req, res) => {

    let topic = req.body.topic;
    let data = req.body.data;
    let month = new Date().getMonth() + 1;
    let date = new Date().getDate();
    let year = new Date().getFullYear();
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    checkedRadio = req.body.checked;

    sql_insertion(req.body.topic, req.body.data, year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

    function sql_insertion(param1, param2, param3) {

        let statement = `INSERT INTO posts (topic, data, timestamp) VALUES ('${param1}', '${param2}', '${param3}')`;
        connection.query(statement, (err, result) => {
    
            if (err) { panic(err) }
    
            else { 
                console.log(result); 
            }
        })
        res.send('Post added');
    }
});


app.get('/postmessage', (req, res) => {
    
    if (checkedRadio == 'topic-ascend') {
        connection.query("SELECT * FROM posts ORDER BY topic ASC", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }

    else if (checkedRadio == 'topic-descend') {
        connection.query("SELECT * FROM posts ORDER BY topic DESC", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }

    else if (checkedRadio == 'time-ascend') {
        connection.query("SELECT * FROM posts ORDER BY timestamp ASC", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }

    else if (checkedRadio == 'time-descend') {
        connection.query("SELECT * FROM posts ORDER BY timestamp DESC", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
  
});


app.use("/", express.static(path.join(__dirname, "pages")))


app.listen(PORT, HOST);
console.log('up and running');