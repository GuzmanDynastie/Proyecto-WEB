const router = require('express').Router();
const path = require('path');

router.get('/shopping/shopping_cart', (req, res) => {
    res.render('shopping/shopping_cart');
});

module.exports = router;