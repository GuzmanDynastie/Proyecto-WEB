const router = require('express').Router();
const path = require('path');

router.get('/shipping', (req, res) => {
    res.render('shipping');
});

module.exports = router;