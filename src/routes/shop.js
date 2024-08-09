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
        const page = parseInt(req.query.page) || 1;
        const limit = 20;

        if (selectedCategory && selectedCategory !== 'todo') {
            query.petCharacteristics = selectedCategory;
        }

        const [products, totalProducts] = await Promise.all([
            productSchema.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            productSchema.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        const { brandsWithCounts, flavorsWithCounts } = await getBrandsAndFlavors();

        res.render('shopping/shop', {
            products,
            currentPage: page,
            totalPages,
            brandsWithCounts,
            flavorsWithCounts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor.');
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


// Función para obtener la lista de marcas y sabores omitiendo las repetidas y llamando a countBrandsAndFlavors
async function getBrandsAndFlavors() {
    try {
        const uniqueBrands = await productSchema.distinct("generalCharacteristics.1", { status: true });
        const uniqueFlavors = await productSchema.distinct("specifications.0", { status: true });

        const { countsBrands, countsFlavors } = await countBrandsAndFlavors(uniqueBrands, uniqueFlavors);

        return {
            brandsWithCounts: uniqueBrands.map((brand, index) => ({ brand, count: countsBrands[index] })),
            flavorsWithCounts: uniqueFlavors.map((flavor, index) => ({ flavor, count: countsFlavors[index] }))
        };
    } catch (error) {
        console.log(error);
    }
}

// Función que recibe la lista de las marcas y sabores e itera en cada una para devolver una lista de productos por marca y sabor
async function countBrandsAndFlavors(brands, flavors) {
    try {
        const countsBrands = [];
        const countsFlavors = [];

        for (const brand of brands) {
            const count = await productSchema.countDocuments({ status: true, "generalCharacteristics.1": brand });
            countsBrands.push(count);
        }

        for (const flavor of flavors) {
            const count = await productSchema.countDocuments({ status: true, "specifications.0": flavor });
            countsFlavors.push(count);
        }

        return { countsBrands, countsFlavors };
    } catch (error) {
        console.log(error);
    }
};


module.exports = router;