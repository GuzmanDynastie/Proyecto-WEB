const router = require('express').Router();
const path = require('path');

router.get('/payment', (req, res) => {
    res.render('payment');
});

module.exports = router;