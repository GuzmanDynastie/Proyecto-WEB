const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home', { user: req.session.destroy() });
});

module.exports = router;