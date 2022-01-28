const mongoose = require('mongoose');
// const shortid = require('shortid')


// const orderModel = mongoose.model(
//   "orders",
//   new mongoose.Schema({
//       // _id: { type: String, default: shortid.generate },
//       name: String,
//       email: String,
//       address: String,
//       total: Number,
//       items: [{
//           _id: String,
//           title: String,
//           count: Number,
//           price: Number,
//       }]
//   },
//       {
//           timestamps: true, // createdAt | updatedAt
//       }
//   )
// );

// module.exports = orderModel;


const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        itemType: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        slug: { type: String, required: true },
        productID: {
          type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true,
        },
        // seller: { 
        //   type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true }
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
      // geoLocation: {
      lat: String,
      lng: String,
      // address: String,
      // name: String,
      // vicinity: String,
      // googleAddressId: String,
      // }
      // email: { type: String, required: true },
    },
    paymentMethod: { type: String },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number },
    shippingPrice: { type: Number },
    taxPrice: { type: Number },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.models?.Order || mongoose.model('Order', orderSchema);
module.exports = orderModel;
