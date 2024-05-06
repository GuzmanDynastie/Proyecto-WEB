const router = require('express').Router();
const discrepanceSchema = require('../models/discrepance');

router.get('/users/userDiscrepance', (req, res) => {
    res.render('users/userDiscrepance');
});

router.post('/users/userDiscrepance', async (req, res) => {
    const discErrors = [];
    const { discrepance } = req.body;
    try {
        if (discErrors.length > 0) {
            res.render('/users/userDiscrepance', { discErrors });
        } else {
            const newDiscrepance = new discrepanceSchema({ discrepance });
            await newDiscrepance.save();
            res.redirect('/');
        }
    } catch (error) {
        // status 500
        discErrors.push({ text: 'Ocurrió un error al guardar el usuario. Por favor, inténtalo de nuevo.' });
    }
});

module.exports = router;