const router = require('express').Router();
const userSchema = require('../models/user');

router.get('/users/userLogin', (req, res) => {
    res.render('users/userLogin')
});

router.post('/users/userLogin', async (req, res) => {
    const { email, password } = req.body;
    const loginErrors = [];

    const userEmail = await userSchema.findOne({ email });
    if (!userEmail) {
        loginErrors.push({ text: 'Correo no encontrado.' });
    } else {
        const isValidPassword = await userEmail.matchPassword(password);
        if (!isValidPassword) {
            loginErrors.push({ text: 'Contraseña incorrecta.' });
        };
    };

    if (loginErrors.length > 0) {
        res.render('users/userLogin', { loginErrors, email });
    } else {
        try {

            if (!req.session.user) {
                req.session.user = {
                    name: userEmail.name,
                    surname: userEmail.surname,
                    image: userEmail.image
                }
            }

            if (userEmail.role === 'admin') {
                if (!req.session.welcomeMessageShown) {
                    req.session.welcomeMessageShown = true;
                    return res.render('admin/homeAdmin', { user: req.session.user, showWelcomeMessage: true });
                }
                return res.render('admin/homeAdmin', { user: req.session.user, showWelcomeMessage: false });
            } else {
                return res.redirect(302, '/');
            };
        } catch (error) {
            console.error('Error de autenticación:', error);
            return res.status(500).send('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
        };
    };
});

module.exports = router;