const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const multer = require("multer");

var productsRouter = require('./routes/products');

const imgSchema = require('./models/imageModel')

const app = express()

app.use(bodyParser.urlencoded(
    { extended:true }
))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/products', productsRouter);

app.set("view engine", "ejs");



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

mongoose.connect('mongodb+srv://sneha:sneha@cluster0.rodg8nr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected!')
        
        app.get('/', (req, res) => {
            imgSchema.find({})
            .then((data, err)=>{
                if(err){
                    console.log(err);
                }
                res.render('imagepage',{items: data})
            })
        });

        app.post('/', upload.single('image'), (req, res, next) => {
 
            var obj = {
                name: req.body.name,
                desc: req.body.desc,
                img: {
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
            }
            imgSchema.create(obj)
            .then ((err, item) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // item.save();
                    res.redirect('/');
                }
            });
        });


        app.listen(3000, () => {
            console.log('Node API is running on port 3000')
        })
    }
    );




