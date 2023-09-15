const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const multer = require("multer");

const Product = require('./models/productModel')
const imgSchema = require('./models/imageModel')

const app = express()

app.use(bodyParser.urlencoded(
    { extended:true }
))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

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

mongoose.connect('mongodb+srv://shreyalahirisp:sushi080693@cluster0.yykawl0.mongodb.net/NODE-API?retryWrites=true&w=majority')
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

        app.get('/products', async(req, res) => {
            try {
                const products = await Product.find({});
                res.status(200).json(products);
            } catch (error) {
                res.status(500).json({message: error.message})
            }
        })

        app.get('/products/:id', async(req, res) =>{
            try {
                const {id} = req.params;
                const product = await Product.findById(id);
                res.status(200).json(product);
            } catch (error) {
                res.status(500).json({message: error.message})
            }
        })

        app.post('/products', async(req, res) => {
            try {
                const product = await Product.create(req.body)
                res.status(200).json(product);
                
            } catch (error) {
                console.log(error.message);
                res.status(500).json({message: error.message})
            }
        })

        app.put('/products/:id', async(req, res) => {
            try {
                const {id} = req.params;
                const product = await Product.findByIdAndUpdate(id, req.body);
                // we cannot find any product in database
                if(!product){
                    return res.status(404).json({message: `cannot find any product with ID ${id}`})
                }
                const updatedProduct = await Product.findById(id);
                res.status(200).json(updatedProduct);
                
            } catch (error) {
                res.status(500).json({message: error.message})
            }
        })

        app.delete('/products/:id', async(req, res) =>{
            try {
                const {id} = req.params;
                const product = await Product.findByIdAndDelete(id);
                if(!product){
                    return res.status(404).json({message: `cannot find any product with ID ${id}`})
                }
                res.status(200).json(product);
                
            } catch (error) {
                res.status(500).json({message: error.message})
            }
        })

        app.listen(3000, () => {
            console.log('Node API is running on port 3000')
        })
    }
    );




