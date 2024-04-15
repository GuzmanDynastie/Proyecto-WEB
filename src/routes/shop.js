const router = require('express').Router();
const path = require('path');
const productSchema = require('../models/product')

router.get('/shopping/shop', async (req, res) => {
    const products = await productSchema.find();
    res.render('shopping/shop', { products });
});

module.exports = router;