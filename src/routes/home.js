const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home', { showInterface: true });
});

router.post('/close/session', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;