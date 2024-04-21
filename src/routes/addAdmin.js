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

router.get('/admin/addAdmin', (req, res) => {
    res.render('admin/addAdmin');
});

router.post('/admin/addAdmin', imageAdmin.single('image'), async (req, res) => {
    const role = 'admin';
    const registerErrors = [];
    const registerSuccessful = [{ text: 'El administrador se ha registrado exitosamente!' }];

    const { name, surname, email, password, password_2 } = req.body;
    const image = saveImageAdmin(req.file);

    if (domain.some(domain => email.endsWith(domain))) {
        if (password == password_2) {
            const emailDB = await userSchema.findOne({ email: email });

            if (emailDB) {
                try {
                    const newAdmin = new userSchema({ name, surname, email, password, image, role });
                    newAdmin.password = await newAdmin.encryptPassword(password);
                    await newAdmin.save();
                    res.render('admin/addAdmin', { registerSuccessful });
                } catch (error) {
                    // status 500
                    registerErrors.push({ text: 'Ocurrió un error al guardar el usuario. Por favor, inténtalo de nuevo.' });
                }
            } else {
                registerErrors.push({ text: 'El correo ingresado ya esta registrado.' });
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
        res.render('admin/addAdmin', { registerErrors, name, surname, email })
    }
});

module.exports = router;