const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true, },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, default: 0, required: true },
    // availableSizes: [{ type: String, unique: true }],
    inStack: [{
        key: { type: String, unique: true, required: true },
        value: { type: Number, required: true }
    }],
    seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    reviewNum: { type: Number, default: 0, required: true },
    // countInStock: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
    numReviews: { type: Number, default: 0, required: true },
    reviews: [reviewSchema],
    campaigns: [{ type: String, unique: true }] // campaign Name
}, {
    timestamps: true
});


// console.log('mongoose.models:', mongoose.models)
const productModel = mongoose.models?.Product || mongoose.model('Product', productSchema);
module.exports = productModel;