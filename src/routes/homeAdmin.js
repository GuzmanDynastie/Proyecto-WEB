const router = require('express').Router();

router.get('/admin/homeAdmin', (req, res) => {
    res.render('admin/homeAdmin', { user: req.session.user });
});

module.exports = router;