const router = require('express').Router();
const path = require('path');

router.get('/shopping_cart', (req, res) => {
    res.render('shopping_cart');
});

module.exports = router;