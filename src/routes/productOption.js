const router = require('express').Router();
const productSchema = require('../models/product');

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

router.get('/admin/productOption', async (req, res) => {
    const product = await productSchema.find().lean();
    product.forEach(product => {
        product.formattedExpiration = formatDate(new Date(product.expiration));
    });
    res.render('admin/productOption', { product });
});

router.post('/admin/productOption', async (req, res) => {
    try {
        let query = {};
        if (req.body.search) {
            const searchTerms = req.body.search.trim().split(/\s+/);
            const orConditions = searchTerms.map(term => ({
                $or: [
                    { 'petCharacteristics.0': { $regex: new RegExp(term, 'i') } },
                    { 'generalCharacteristics.1': { $regex: new RegExp(term, 'i') } },
                    { 'specifications.0': { $regex: new RegExp(term, 'i') } },
                    { 'specifications.1': { $regex: new RegExp(term, 'i') } },
                    { 'generalCharacteristics.2': { $regex: new RegExp(term, 'i') } }
                ]
            }));
            query = { $and: orConditions };
        }

        const product = await productSchema.find(query).lean();
        product.forEach(product => {
            product.formattedExpiration = formatDate(new Date(product.expiration));
        });
        res.render('admin/productOption', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;