// const fs = require('fs');
// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const cors = require('cors');

// app.use(cors());
// app.use(bodyParser.json());

// app.post('/saveData', (req, res) => {
//     // Check if photoUpload is defined
//     if (req.body.photoUpload) {
//         // Get the base64 string from the request body
//         let base64String = req.body.photoUpload;
        
//         // Remove header
//         let base64Image = base64String.split(';base64,').pop();
        
//         // Generate a filename using entryid, purchaseDate, and name
//         let filename = `./public/photo-uploads/${req.body.entryid}_${req.body.purchaseDate}_${req.body.fullName}.png`;
        
//         // Write the image file to the local folder
//         fs.writeFile(filename, base64Image, {encoding: 'base64'}, function(err) {
//             if (err) {
//                 console.log('Error: ', err);
//                 res.status(500).send({error: 'Failed to save image'});
//             } else {
//                 console.log('File created');
//                 res.send({message: 'Data received and image file created', filename: filename});
//             }
//         });
//     } else {
//         res.status(400).send({error: 'photoUpload is not defined in the request body'});
//     }
// });

// app.listen(3000, () => console.log('Server started on port 3000'));


const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// Create a connection pool
const pool = mysql.createPool({
  host: 'test-game-data.c1wmq8mc4ovm.ap-southeast-1.rds.amazonaws.com',
  user: 'gameuser',
  password: 'password',
  database: 'gamedata'
});

app.post('/saveData', async (req, res) => {
    // Check if photoUpload is defined
    if (req.body.photoUpload) {
        // Get the base64 string from the request body
        let base64String = req.body.photoUpload;
        
        // Remove header
        let base64Image = base64String.split(';base64,').pop();
        
        // Generate a filename using entryid, purchaseDate, and name
        let filename = `./public/photo-uploads/${req.body.entryid}_${req.body.purchaseDate}_${req.body.fullName}.png`;
        
        // Write the image file to the local folder
        fs.writeFile(filename, base64Image, {encoding: 'base64'}, function(err) {
            if (err) {
                console.log('Error: ', err);
                res.status(500).send({error: 'Failed to save image'});
            } else {
                console.log('File created');
                
                // Save the data in the MySQL database
                const query = 'INSERT INTO game_entry_two SET ?';
                const data = {
                    email_address: req.body.emailAddress,
                    entry_date: req.body.entrydate,
                    //entryid: req.body.entryid,
                    full_name: req.body.fullName,
                    ic_number: req.body.icNumber,
                    lives: req.body.lives,
                    mobile_number: req.body.mobileNumber,
                    photo_upload: filename,
                    purchase_date: req.body.purchaseDate,
                    result: req.body.result,
                    score: req.body.score,
                    state: req.body.state,
                    store_name: req.body.storeName,
                    time: req.body.time,
                    remaining_time: req.body.remaining_time
                };
                
                pool.query(query, data, function(err, results) {
                    if (err) {
                        console.log('Error: ', err);
                        res.status(500).send({error: 'Failed to save data in the database'});
                    } else {
                        console.log('Data saved in the database');
                        res.send({message: 'Data received, image file created, and data saved in the database', filename: filename});
                    }
                });
            }
        });
    } else {
        res.status(400).send({error: 'photoUpload is not defined in the request body'});
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
