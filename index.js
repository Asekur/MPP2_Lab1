const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');

const Car = require('./model/car');
const db = 'mongodb+srv://admin:admin@cluster0.8p7at.mongodb.net/Cars?retryWrites=true&w=majority';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Connected'))
    .catch((error) => console.log(error));

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('photo');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static("uploads"));

app.get('/', (req, res) => {
    Car.find()
        .then((result) => {
            res.render("index", {
                cars: result
            })
        })
        .catch((err) => {
            res.send(err)
        });
});

app.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                const car = new Car({
                    photo: "uploads/" + req.file.filename
                });
                car.save();
                Car.find()
                    .then((result) => {
                        res.render("index", {
                            cars: result,
                            msg: 'File Uploaded!'
                        })
                    })
                    .catch((err) => {
                        res.send(err)
                    });
            }
        }
    });
});

const portID = 3000;
app.listen(portID, () => console.log(`Server started on port ${portID}`));