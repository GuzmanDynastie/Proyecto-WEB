const express = require('express');
const router = express.Router();
const productSchema = require('../models/product');

router.post('/webhook', async (req, res) => {
    try {
        const nameBrandSolicited = req.query.marca;
        console.log(nameBrandSolicited)

        const productsInDB = await productSchema.find();
        const brandExists = productsInDB.some(product => {
            return product.generalCharacteristics.includes(nameBrandSolicited);
        });

        if (brandExists) {
            res.json({ existe: true, mensaje: `La marca ${nameBrandSolicited} existe en la base de datos.` });
        } else {
            res.json({ existe: false, mensaje: `La marca ${nameBrandSolicited} no existe en la base de datos.` });
        }
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
});

module.exports = router;