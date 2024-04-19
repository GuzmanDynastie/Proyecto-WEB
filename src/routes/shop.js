const router = require('express').Router();
const productSchema = require('../models/product')

router.get('/shopping/shop', async (req, res) => {
    const products = await productSchema.find().lean();
    res.render('shopping/shop', { products });
});

module.exports = router;