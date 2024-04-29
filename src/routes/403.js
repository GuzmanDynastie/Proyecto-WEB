const router = require('express').Router();

router.get('/error/403', (req, res) => {
    res.render('error/403');
});

module.exports = router;