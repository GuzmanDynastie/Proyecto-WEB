const router = require('express').Router();
const userSchema = require('../models/user');
const multer = require('multer');
const fs = require('node:fs');

const domain = ['@support.com'];

const imageAdmin = multer({ dest: 'uploads/images_admin/' });

function saveImageAdmin(file) {
    const newPath = `./uploads/images_admin/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}

router.get('/admin/adminRegister', (req, res) => {
    res.render('admin/adminRegister');
});

router.post('/admin/adminRegister', imageAdmin.single('image'), async (req, res) => {
    const role = 'admin';
    const registerErrors = [];

    const { name, surname, email, password, password_2 } = req.body;
    const image = saveImageAdmin(req.file);

    if (domain.some(domain => email.endsWith(domain))) {
        if (password == password_2) {
            try {
                const newAdmin = new userSchema({ name, surname, email, password, image, role });
                newAdmin.password = await newAdmin.encryptPassword(password);
                await newAdmin.save();
                res.redirect('/admin/homeAdmin');
            } catch (error) {
                // status 500
                registerErrors.push({ text: 'Ocurrió un error al guardar el usuario. Por favor, inténtalo de nuevo.' });
            }
        } else {
            // status 400
            registerErrors.push({ text: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.' });
        }
    } else {
        // status 400
        registerErrors.push({ text: 'El correo electrónico ingresado no es válido. Por favor, utiliza una dirección de correo electrónico válida.' });
    }

    if (registerErrors.length > 0) {
        res.render('admin/adminRegister', { registerErrors, name, surname, email })
    }
});

module.exports = router;