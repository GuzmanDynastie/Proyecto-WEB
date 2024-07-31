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
    const emailDB = await userSchema.findOne({ email: email })
    const registerErrors = [];

    if (password !== password_2) {
        registerErrors.push({ text: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.' });
    }

    if (!domain.some(domain => email.endsWith(domain))) {
        registerErrors.push({ text: 'El correo electrónico ingresado no es válido. Por favor, utiliza una dirección de correo electrónico válida.' });
    }

    if (emailDB) {
        registerErrors.push({ text: 'El correo electrónico ya esta registrado.' });
    }

    if (registerErrors.length > 0) {
        res.render('users/userRegister', { registerErrors, name, surname, email });
    } else {
        try {
            const newUser = new userSchema({ name, surname, email, password, image, role });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            res.redirect('/users/userLogin');
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocurrió un error al guardar el usuario. Por favor, inténtalo de nuevo.');
        }
    }
});

module.exports = router;




































async function handleOrderInformation(req, res) {
    const { token, email, code } = req.body;

    try {
        const order = await orderSchema.findOne({ token });
        if (!order) {
            return res.json({
                mensaje: "Orden no encontrada.",
                flag: "false"
            });
        } else {
            res.json({
                mensaje: "Orden confirmada.",
                flag: "true"
            });

            const { id_user } = order;

            const user = await userSchema.findOne({ _id: id_user, email: email });
            if (!user) {
                return res.json({ 
                    mensaje: "El email no corresponde a la orden ingresada",
                    flag: "false"
                });
            } else {
                let value = handleSendEmail(req, res);
                res.json({
                    mensaje: "Ingresa el codigo que te envie al email (ejemplo: NH-XXXXXX)",
                    flag: "true"
                });

                if (!value === code) {
                    return res.json({
                        mensaje: "No ingresaste bien el codigo.",
                        flag: "false"
                    });
                } else {
                    return res.json({
                        mensaje: "",
                        flag: "true"
                    });
                }

                
            }

            return res.json({ mensaje: order.status_order });
        }

    } catch (error) {
        console.log("Error al validar la informacion.", error);
        return res.status(500).json({ mensaje: "Error al validar la informacion." });
    }
}