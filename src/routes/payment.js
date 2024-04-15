const router = require('express').Router();
const path = require('path');

router.get('/shopping/payment', (req, res) => {
    res.render('shopping/payment');
});

module.exports = router;