const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true, },
    // campaignManagerID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, },
    // slug: { type: String, required: true, unique: true },
    // dateEnds: Date
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    
    managerName: { type: String, required: true, },
    name: { type: String, required: true, unique: true }, // w.space _ as Slug
    image: { type: String, required: true },
    
    isGlobal: { type: Boolean, required: true, default: true }, // as is it on all the products ?
    description: String,
    priceOff: Number,
    isActive: Boolean,
});


// console.log('mongoose.models:', mongoose.models)
const campaignModel = mongoose.models?.Campaign || mongoose.model('Campaign', campaignSchema);
module.exports = campaignModel;