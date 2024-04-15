const router = require('express').Router();
const userSchema = require('../models/user');

router.get('/users/userLogin', (req, res) => {
    res.render('users/userLogin')
});

router.post('/users/userLogin', async (req, res) => {
    const { name, email } = req.body;
    const registerErrors = [];

    if (registerErrors.length > 0) {
        res.render('users/userLogin', { registerErrors, name, surname });
    } else {
        try {
            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocurrió un error al guardar el usuario. Por favor, inténtalo de nuevo.');
        }
    }
});

module.exports = router;