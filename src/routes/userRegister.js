const router = require('express').Router();
const userSchema = require('../models/user');

const domain = ['@gmail.com', '@hotmail.com', '@hotmail.es', '@outlook.es', '@outlook.com', '@universidad-une.com'];

router.get('/users/userRegister', (req, res) => {
    res.render('users/userRegister')
});

router.post('/users/userRegister', async (req, res) => {
    const role = 'user';
    const image = '';
    const { name, surname, email, password, password_2 } = req.body;
    const registerErrors = [];

    if (password !== password_2) {
        registerErrors.push({ text: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.' });
    }

    if (!domain.some(domain => email.endsWith(domain))) {
        registerErrors.push({ text: 'El correo electrónico ingresado no es válido. Por favor, utiliza una dirección de correo electrónico válida.' });
    }

    if (!email.endsWith('@support.com')) {
        try {
            const emailUser = await userSchema.findOne({ email: email });
            if (emailUser) {
                registerErrors.push({ text: 'Ya está registrado este correo.' });
            }
        } catch (error) {
            console.log(error);
            registerErrors.push({ text: 'Ocurrió un error al verificar el correo electrónico. Por favor, inténtalo de nuevo.' });
        }
    }

    if (registerErrors.length > 0) {
        res.render('/users/userRegister', { registerErrors, name, surname });
    } else {
        try {
            const newUser = new userSchema({ name, surname, email, password, image, role });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocurrió un error al guardar el usuario. Por favor, inténtalo de nuevo.');
        }
    }
});

module.exports = router;