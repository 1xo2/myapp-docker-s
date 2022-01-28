const express = require('express');
const expressAsyncHandler = require('express-async-handler');
//const { utils } = require('../../src/utils.js')
const orderModel = require('../DBModels/orderModel');
const { isUser } = require('../utils-server');
const orderRouter = express.Router();


console.log('Enter: Router:: Product')


orderRouter.get('/', isUser, expressAsyncHandler(async (req, res) => {

    try {
        const dbOrders = await orderModel.find({})
        //console.log('---products:', products)
        res.send({ dbOrders })
    } catch (error) {

        return res.status(404).send({
            // Error 404 the requested resource is not found
            msg: " Error in getting Orders",
            err: error.message,
        });
    }

}))

orderRouter.post('/', isUser, expressAsyncHandler(async (req, res) => {

    try {

        if (!req.body.order.DB_id ||
            !req.body.order.email ||
            !req.body.order.address ||
            !req.body.order.name ||
            !req.body.order.totalPrice ||
            !req.body.order.orderItems ||
            req.body.order.orderItems.length == 0
        ) {
            return res.status(400).send({
                msg: " Error: bad request: object not have all fields s9ad8f7",
            });
        }


        // var ObjectId = require('mongoose').Types.ObjectId;


        const o = req.body.order;
        const orderItemsArr = []

        o.orderItems.forEach(i => {


            orderItemsArr.push(
                {
                    name: i.title,
                    qty: i.count,
                    image: i.image,
                    price: i.price,
                    productID: i._id,
                    seller: i.seller,
                }
            )

        });


        const orderSchema =
        {
            orderItems: orderItemsArr,
            shippingAddress: {
                fullName: o?.name,
                address: o?.address,
                // city:'',
                // postalCode:'',
                // country:'',
                email: o?.email
            },
            // paymentMethod:'',
            // paymentResult: {
            //     id: '',
            //     status: 'paid',
            //     update_time: '',
            //     email_address: '',
            // },
            // itemsPrice: 0,
            // shippingPrice: 0,
            // taxPrice: 0,
            totalPrice: o?.totalPrice,
            user: o.DB_id,
            // seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
            // isPaid: false,
            // paidAt: { type: Date },
            // isDelivered:  false ,
            // deliveredAt: { type: Date },
        };


        const postedOrder = new orderModel(orderSchema)

        const savedOrder = await postedOrder.save();
        if (savedOrder) {
            res.status(200).send(savedOrder)
        }

    } catch (error) {

        return res.status(404).send({
            // Error 404 the requested resource is not found
            msg: " Error in saving Order",
            err: error.message,
        });
    }

}))

orderRouter.delete('/:id', isUser, expressAsyncHandler(async (req, res) => {

    try {
        console.log('req.params.id:', req.params.id)

        const deletedOrder = await orderModel.findByIdAndDelete(req.params.id)

        if (deletedOrder) {
            res.send({ deletedOrder })
        }
    } catch (error) {

        return res.status(404).send({
            // Error 404 the requested resource is not found
            msg: " Error in deleting order",
            err: error.message,
        });
    }

}))

module.exports = orderRouter;