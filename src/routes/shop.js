const router = require('express').Router();
const path = require('path');

router.get('/shop', (req, res) => {
    res.render('shop')
});

module.exports = router;