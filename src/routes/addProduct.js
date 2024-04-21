const router = require('express').Router();
const productSchema = require('../models/product');
const { route } = require('./addAdmin');

router.get('/admin/addProduct', (req, res) => {
    res.render('admin/addProduct');
});

module.exports = router;