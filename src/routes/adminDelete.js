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

// Mientras navegaba por la tienda en línea, me encontré con una amplia selección de sabores tentadores para perros, que incluían opciones como pollo asado, cordero y arroz, y salmón con batata. Sin embargo, al buscar opciones para mi amado gato, me decepcionó ver que las croquetas estaban disponibles principalmente en sabores de pollo y pescado. Como dueño de un gato que conoce sus preferencias alimenticias, esperaba encontrar una variedad más amplia de opciones que reflejaran la diversidad de sabores que a mi gato le gusta disfrutar. Esta discrepancia me dejó preguntándome si debería considerar cambiar a otra tienda en línea que ofrezca una gama más amplia de sabores para satisfacer las exigentes papilas gustativas de mi gato.

module.exports = router;