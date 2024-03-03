var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var fs = require('fs'); // Add this line
var app = express();

app.use(cors());
app.use(bodyParser.json());

var connection = mysql.createConnection({
  host     : 'sql6.freemysqlhosting.net',
  user     : 'sql6686763',
  password : 'DGt2X1pKXr',
  database : 'sql6686763'
});

app.post('/saveData', function (req, res) {
    var data = req.body; 
    console.log(data);

    connection.connect(function(err) {
      if (err) {
        fs.appendFile('failed-data.log', err + '\n', function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
        throw err;
      }
      console.log("Connected!");

      var sql = "INSERT INTO gameData SET ?"; 
      connection.query(sql, data, function (err, result) {
        if (err) {
          fs.appendFile('failed-data.log', err + '\n', function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
          throw err;
        }
        console.log("Data inserted");
        res.send('Data inserted');
      });

      connection.end();
    });
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});