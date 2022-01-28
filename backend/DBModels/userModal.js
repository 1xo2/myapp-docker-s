const mongoose = require('mongoose')


const sellerSchema = new mongoose.Schema({
    name: String,
    logo: String,
    description: String,
    rating: { type: Number, default: 0, required: true },
    numReviews: { type: Number, default: 0, required: true },
})

const UserSchema = new mongoose.Schema({
    // _id: { type: mongoose.ObjectId, required:true, auto: true },
    // glID: { type: String, required: false },
    // fbID: { type: String, required: false },
    name: { type: String, required: true },
    password: { type: String, required: true },
    // picture: { type: String, required:false },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean },
    isSuperAdmin: { type: Boolean },
    isSeller: { type: Boolean },
    seller: sellerSchema,
    // createdAt: { type: Date, required: true, default: Date.now }
});


const userModal = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = userModal