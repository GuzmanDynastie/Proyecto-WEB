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

router.get('/admin/addProduct', (req, res) => {
    if (req.session.user) {
        res.render('admin/addProduct', { user: req.session.user });
    } else {
        // status 403
        res.redirect('/error/403');
    }
});

router.post('/admin/addProduct', imageProduct.array('image_product', 10), async (req, res) => {
    const { piece, stock, pricePerUnit, expiration, principalCharacteristics, petCharacteristics, specifications, generalCharacteristics, others, description } = req.body;
    const images = [];
    const registerErrors = [];
    const registerSuccessful = [{ text: 'El producto se ha registrado exitosamente!' }];

    const brand = generalCharacteristics[1];
    const animalCategory = petCharacteristics[0];
    const line = generalCharacteristics[2];
    const category = petCharacteristics[1];

    req.files.forEach(file => {
        const imagePath = saveImageProduct(file, brand, animalCategory, line, category);
        images.push(imagePath);
    });

    try {
        if (registerErrors.length > 0) {
            res.render('admin/addProduct', { registerErrors });
        } else {
            const newSchema = new productSchema({ images, piece, stock, pricePerUnit, expiration, principalCharacteristics, petCharacteristics, specifications, generalCharacteristics, others, description });
            await newSchema.save();
            res.render('admin/addProduct', { registerSuccessful });
        }
    } catch (error) {
        // status 500
        registerErrors.push({ text: 'Ocurrió un error al guardar el producto. Por favor, inténtalo de nuevo.' });
    }
});

module.exports = router;