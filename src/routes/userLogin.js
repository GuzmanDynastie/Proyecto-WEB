const router = require('express').Router();
const user = require('../models/user');
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
                    _id: userEmail._id,
                    name: userEmail.name,
                    surname: userEmail.surname,
                    email: userEmail.email,
                    role: userEmail.role,
                    image: userEmail.image
                }
            }

            // if (userEmail.role === 'admin') {
            if (req.session.user.role === 'admin') {
                if (!req.session.welcomeMessageShown) {
                    req.session.welcomeMessageShown = true;
                    return res.render('admin/homeAdmin', { user: req.session.user, showWelcomeMessage: true });
                }
                return res.render('admin/homeAdmin', { user: req.session.user, showWelcomeMessage: false });
            } 
            if (req.session.user.role === 'user') {
                return res.render('home', { showDiscrepance: true });
            };
        } catch (error) {
            console.error('Error de autenticación:', error);
            return res.status(500).send('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
        };
    };
});

module.exports = router;