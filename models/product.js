const mongoose=require('mongoose');

const productSchema= new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        lowercase:true,
        enum:['fruit','vegetable','dairy']  //The enum validator is an array that will check if the value given is an item in the array.
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;