const router = require('express').Router();
const path = require('path');

router.get('/shopping/shipping', (req, res) => {
    res.render('shopping/shipping');
});

module.exports = router;