const express=require('express')
const app= express();
const path =require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Product = require('./models/product');
mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err =>{
        console.log("OH NO ERROR!!!")
        console.log(err)
    })

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

const categories=['fruits','vegetable','dairy'];

 app.get('/products', async(req,res) => {
    //querying poduct model
    const {category}=req.query;
    if(category) {
        const products= await Product.find({category})  //async route handler for mongoose operation
        res.render('products/index', {products, category})
    } else{
        const products= await Product.find({})  //async route handler for mongoose operation
        res.render('products/index', {products, category:'All'})
    }
 })

app.get('/products/new',(req,res) => {
    res.render('products/new',{categories});
})

app.post('/products',async(req,res) => {
     const newProduct=new Product(req.body);
     await newProduct.save();
     console.log(newProduct);
     res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id',async(req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id)     //easiker to use findById
    // const product = await Product.find( x => x.id === id);  not working
    res.render('products/show', {product})
})

app.get('/products/:id/edit',async(req,res) =>{
    const {id} = req.params;
    const product= await Product.findById(id);
    res.render('products/edit', {product, categories})
})
app.patch('/products/:id', async(req,res) => {
    const {id}=req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators:true, new:true}); //mongoose id and update run validators by default.mongoose line
    res.redirect(`/products/${product._id}`);  //can update over and over again.taking to show page
})

app.delete('/products/:id',async(req,res) => {
    const {id} = req.params;
   const product = await Product.findByIdAndDelete(id);
   res.redirect('/products');
})

app.listen(3000, ()=>{
    console.log("APP IS LISTENING");
})