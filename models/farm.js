const mongoose = require('mongoose');
const Product = require('./product');
const { Schema } = mongoose;

const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name!']
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});


// DELETE ALL ASSOCIATED PRODUCTS AFTER A FARM IS DELETED. this is a query middleware with post and pre status of the middleware.
farmSchema.post('findOneAndDelete', async function (farm) {
    if (farm.products.length) {
        const res = await Product.deleteMany({ _id: { $in: farm.products } })    //delete all products where their id is in the product array of the farm.
        console.log(res);
    }
})

const Farm=mongoose.model('Farm', farmSchema);

module.exports=Farm;