const router = require('express').Router();
const userSchema = require('../models/user');

router.get('/admin/adminDelete', async (req, res) => {
    const admin = await userSchema.find({ role: 'admin', status: true }).lean();
    res.render('admin/adminDelete', { admin });
});

router.post('/admin/adminDelete/:id', async (req, res) => {
    try {
        const user = await userSchema.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { status: false } },
            { new: true }
        ).lean();
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        const registerSuccessful = { text: `Se ha eliminado el usuario: ${user.name} ${user.surname}.` };

        const admin = await userSchema.find({ role: 'admin', status: true }).lean();
        res.render('admin/adminDelete', { admin, registerSuccessful });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        const registerErrors = { text: 'Error al eliminar usuario.' };
        const admin = await userSchema.find({ role: 'admin', status: true }).lean();
        res.status(500).render('admin/adminDelete', { admin, registerErrors });
    }
});

module.exports = router;