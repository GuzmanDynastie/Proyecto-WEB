const router = require('express').Router();
const discrepanceSchema = require('../models/discrepance');

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

router.get('/admin/discrepances', async (req, res) => {
    const discrepance = await discrepanceSchema.find().lean();
    discrepance.forEach(discrepance => {
        discrepance.formatExpedition = formatDate(new Date(discrepance.date))
    });
    res.render('admin/discrepances', { discrepance });
});

router.post('/admin/discrepance/:id', async (req, res) => {
    const registerSuccessful = { text: "Se ha eliminado la discrepancia con éxito." };
    const registerErrors = { text: "" };
    try {
        const discrepance = await discrepanceSchema.findByIdAndDelete(req.params.id);

        if (!discrepance) {
            registerErrors.text = "La discrepancia no fue encontrada.";
            const discrepancies = (await discrepanceSchema.find()).lean();
            return res.status(404).render('admin/discrepances', { discrepance: discrepancies, registerErrors });
        }

        const discrepancies = await discrepanceSchema.find().lean();
        discrepancies.forEach(discrepance => {
            discrepance.formatExpedition = formatDate(new Date(discrepance.date));
        }); 

        res.status(200).render('admin/discrepances', { discrepance: discrepancies, registerSuccessful });
    } catch (error) {   
        console.log(error);
        registerErrors.text = "Error interno del servidor.";
        res.status(500).render('admin/discrepances', { discrepance: [], registerErrors });
    }
});

module.exports = router;