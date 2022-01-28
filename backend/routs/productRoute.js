const express = require('express');
const expressAsyncHandler = require('express-async-handler');
//const { utils } = require('../../src/utils.js')
const productModel = require('../DBModels/productModel');
const { isSeller } = require('../utils-server');
const productRouter = express.Router();


console.log('Enter: Router:: Product')


productRouter.get('/', expressAsyncHandler(async (req, res) => {

    try {

        const products = await productModel.find({})
        // console.log('products:', products)

        //console.log('---products:', products)
        res.send({ products }) //: product?.length === 0 ? { msg: 'data source is empty' } : product })
    } catch (error) {

        return res.status(404).send({
            // Error 404 the requested resource is not found
            msg: " Error in getting Products",
            err: error.message,
        });
    }
}))

productRouter.post('/', isSeller, expressAsyncHandler(async (req, res) => {

    try {

        if (!req.body.title || !req.body.description || !req.body.price ||
            req.body.title === '' || req.body.description === '') {
            return res.status(400).send({
                msg: " Error: bad request: object must have a Title, Description and Price data",
            });
        }
        delete req.body._id;
        delete req.body.id;

        const postedProduct = new productModel(req.body)

        const savedProduct = await postedProduct.save();
        if (savedProduct) {
            res.send({ savedProduct })
        }

    } catch (error) {

        return res.status(404).send({
            // Error 404 the requested resource is not found
            msg: " Error in saving Product",
            err: error.message,
        });
    }
}))

productRouter.delete('/:id', isSeller, expressAsyncHandler(async (req, res) => {

    try {
        const postedParams = String(req.params.id)

        const deletedProduct = await productModel.findByIdAndDelete(postedParams);
        if (deletedProduct) {
            res.send({ deletedProduct })
        }

    } catch (error) {

        return res.status(404).send({
            // Error 404 the requested resource is not found
            msg: " Error in deleting Product",
            err: error.message,
        });
    }
}))

module.exports = productRouter;