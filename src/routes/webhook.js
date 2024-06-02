const express = require('express');
const router = express.Router();
const productSchema = require('../models/product');

router.post('/webhook', async (req, res) => {
    try {
        const action = req.body.action;

        switch (action) {
            case 'checkBrand':
                await handleCheckBrand(req, res);
                break;
            case 'anotherAction':
                await handleAnotherAccion(req, res);
                break;
            default:
                res.status(400).json({ error: 'Accion no reconocida.' });
        }

    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
});

async function handleCheckBrand(req, res) {
    try {
        const nameBrandSolicited = req.body.marca;
        const productsInBD = await productSchema.find();
        const brandExists = productsInBD.some(product => {
            return product.generalCharacteristics.includes(nameBrandSolicited);
        });

        if (brandExists) {
            res.json({ existe: true, mensaje: `¡Claro! contamos con la marca <strong>${nameBrandSolicited}</strong>.` });
        } else {
            res.json({ existe: false, mensaje: `Actualmente no tenemos la marca <strong>${nameBrandSolicited}</strong> en nuestra tienda.` });
        }
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
}

async function handleAnotherAccion(req, res) {
    try {
        res.json({ mensaje: 'Accion procesada con exito' });
    } catch (error) {
        console.error('Error al procesar la acción:', error);
        res.status(500).json({ error: 'Error al procesar la acción.' });
    }
}

module.exports = router;