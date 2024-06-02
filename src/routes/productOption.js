const router = require('express').Router();
const productSchema = require('../models/product');
const multer = require('multer');
const fs = require('node:fs');

const imageProduct = multer({ dest: 'uploads/images_product/' });

function saveImageProduct(file, brand, animalCategory, line, category) {
    const destinationDir = `./uploads/images_product/${brand}/${animalCategory}/${line}/${category}/`;
    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
    }
    const newPath = `${destinationDir}${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}


function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

router.get('/admin/productOption', async (req, res) => {
    const product = await productSchema.find({ status: true }).lean();
    product.forEach(product => {
        product.formattedExpiration = formatDate(new Date(product.expiration));
    });
    res.render('admin/productOption', { product });
});

router.post('/admin/productOption', async (req, res) => {
    try {
        let query = { status: true };
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

router.post('/admin/delete/product/:id', async (req, res) => {
    const registerSuccessful = { text: "Se ha eliminado el producto con éxito." };
    const registerErrors = { text: "" };
    try {
        const discrepance = await productSchema.findByIdAndUpdate(req.params.id, { status: false });

        if (!discrepance) {
            registerErrors.text = "El producto no fue encontrado.";
            const product = (await productSchema.find({ status: true })).lean();
            return res.status(404).render('admin/productOption', { product, registerErrors });
        }

        const product = await productSchema.find({ status: true }).lean();

        res.status(200).render('admin/productOption', { product, registerSuccessful });
    } catch (error) {
        console.log(error);
        registerErrors.text = "Error interno del servidor.";
        res.status(500).render('admin/productOption', { product: [], registerErrors });
    }
});

router.post('/admin/update/product/:id', async (req, res) => {
    try {
        const product = await productSchema.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        if (product.expiration) {
            const expirationDate = new Date(product.expiration);
            product.expiration = expirationDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        }

        const infoImage = true;
        res.status(200).render('admin/addProduct', { product, infoImage });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno en el servidor.');
    }
});

router.post('/admin/update/:id', imageProduct.array('image_product', 10), async (req, res) => {
    const productId = req.params.id;

    try {
        const { status, images: uploadedImages, ...newData } = req.body;

        let imagePaths;
        if (uploadedImages && uploadedImages.length > 0) {
            imagePaths = saveImageProduct(req.files);
        }

        if (!(imagePaths && imagePaths.length > 0)) {
            delete newData.images;
        } else {
            newData.images = imagePaths;
        }

        const product = await productSchema.findByIdAndUpdate(productId, newData, { new: true }).lean();

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        const infoUpdate = { text: "Producto actualizado con éxito." };
        return res.status(200).render('admin/homeAdmin', { infoUpdate });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error interno en el servidor.');
    }
});

module.exports = router;