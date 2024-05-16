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

module.exports = router;