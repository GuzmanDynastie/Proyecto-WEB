const router = require('express').Router();
const path = require('path');

router.get('/product', (req, res) => {
    res.render('product');
});

module.exports = router;