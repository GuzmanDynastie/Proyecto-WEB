const router = require('express').Router();
const userSchema = require('../models/user');
const multer = require('multer');
const fs = require('node:fs');

const imageAdmin = multer({ dest: 'uploads/images_admin/' });

function saveImageAdmin(file) {
    const newPath = `./uploads/images_admin/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}

router.get('/admin/homeAdmin', (req, res) => {
    try {
        let user;
        if (req.session.dataNew) {
            user = req.session.dataNew;
        } else {
            if (req.session.user && req.session.user.role === 'admin') {
                user = req.session.user;
            } else {
                // status 403
                return res.redirect('/error/403');
            }
        }
        res.render('admin/homeAdmin', { user });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error interno del servidor');
    }
});

router.post('/admin/homeAdmin/close', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.put('/admin/homeAdmin/:id', imageAdmin.single('image'), async (req, res) => {
    const adminID = req.params.id;
    const { name, surname, email, password, password_2 } = req.body;
    const image = saveImageAdmin(req.file);
    const role = 'admin';

    try {
        if (password !== password_2) {
            throw new Error('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
        }
        const adminToUpdate = await userSchema.findById(adminID);
        if (!adminToUpdate) {
            return res.status(404).send('Usuario no encontrado');
        }

        adminToUpdate.name = name;
        adminToUpdate.surname = surname;
        adminToUpdate.password = password;
        adminToUpdate.role = role;
        adminToUpdate.image = image;

        if (password) {
            const encryptedPassword = await adminToUpdate.encryptPassword(password);
            adminToUpdate.password = encryptedPassword;
        }

        await adminToUpdate.save();

        const _id = adminID;

        req.session.dataNew = {
            _id: _id,
            name: name,
            surname: surname,
            email: email,
            role: role,
            image: image
        }

        res.render('admin/homeAdmin', {
            registerSuccessful: [{ text: 'Usuario actualizado correctamente.' }],
            user: req.session.dataNew
        });
    } catch (error) {
        const registerErrors = [{ text: error.message }];
        res.render('admin/addAdmin', {
            registerErrors,
            user: req.session.dataNew
        });
    }
});

module.exports = router;