const router = require('express').Router();
const path = require('path');

router.get('/shopping/product', (req, res) => {
    res.render('shopping/product');
});

module.exports = router;