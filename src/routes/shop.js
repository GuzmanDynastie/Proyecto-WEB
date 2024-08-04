const router = require('express').Router();
const productSchema = require('../models/product')

let selectedCategory = null;

router.get('/shopping/category/:category', (req, res) => {
    selectedCategory = req.params.category;
    res.redirect('/shopping/shop');
});

router.get('/shopping/shop', async (req, res) => {
    try {
        let query = { status: true };
        if (selectedCategory === 'todo') {
            selectedCategory = null;
            const products = await productSchema.find({ status: true }).lean();
            return res.render('shopping/shop', { products });
        } else if (selectedCategory) {
            query.petCharacteristics = selectedCategory;
        }
        const products = await productSchema.find(query).lean();
        res.render('shopping/shop', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/shopping/shop/:id', async (req, res) => {
    try {
        const productByID = req.params.id;
        const product = await productSchema.findById(productByID).lean();
        if (!product || !product.status) {
            return res.status(404).send('Producto no encontrado.');
        }
        res.render('shopping/product', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.')
    }
});

router.post('/shopping/shop', async (req, res) => {
    try {
        let query = { status: true };
        if (req.body.search) {
            const searchTerms = req.body.search.trim().split(/\s+/);
            const orConditions = searchTerms.map(term => ({
                $or: [
                    { 'petCharacteristics.0': { $regex: new RegExp(term, 'i') } },
                    { 'petCharacteristics.1': { $regex: new RegExp(term, 'i') } },
                    { 'petCharacteristics.2': { $regex: new RegExp(term, 'i') } },
                    { 'generalCharacteristics.1': { $regex: new RegExp(term, 'i') } },
                    { 'specifications.0': { $regex: new RegExp(term, 'i') } },
                    { 'specifications.1': { $regex: new RegExp(term, 'i') } },
                    { 'generalCharacteristics.2': { $regex: new RegExp(term, 'i') } }
                ]
            }));
            query.$and = orConditions;
        }
        if (selectedCategory) {
            query.petCharacteristics = selectedCategory;
        }
        const products = await productSchema.find(query).lean();
        res.render('shopping/shop', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});



module.exports = router;