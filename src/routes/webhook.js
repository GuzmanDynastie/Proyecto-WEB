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
            case 'detailsProduct':
                await handleDetailsProduct(req, res);
                break;
            default:
                res.status(400).json({ error: 'Accion no reconocida.' });
        }

    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
});

async function handleDetailsProduct(req, res) {
    try {
        const { marca: nameBrandSolicited, raza: breedSolicited, etapa: petStage } = req.body;
    
        // Convertir a minúsculas para la búsqueda
        const searchTerms = [nameBrandSolicited.trim().toLowerCase(), breedSolicited.trim().toLowerCase(), petStage.trim().toLowerCase()];
    
        // Buscar todos los productos en la BD
        const productsInBD = await productSchema.find();
    
        // Comprobar si existe la marca
        const brandExists = productsInBD.some(product => product.generalCharacteristics[1].toLowerCase() === nameBrandSolicited.trim().toLowerCase());
    
        let query = { status: true };
    
        if (nameBrandSolicited && breedSolicited && petStage) {
            const orConditions = searchTerms.map(term => ({
                $or: [
                    { 'petCharacteristics.0': { $regex: new RegExp(term, 'i') } },
                    { 'petCharacteristics.1': { $regex: new RegExp(term, 'i') } },
                    { 'generalCharacteristics.1': { $regex: new RegExp(term, 'i') } }
                ]
            }));
            query.$and = orConditions;
        }
    
        if (brandExists) {
            const products = await productSchema.find(query).lean();
    
            if (products.length > 0) {
                const formattedProducts = products.map(product => ({
                    Marca: product.generalCharacteristics[1],
                    Raza: product.petCharacteristics[0],
                    Categoria: product.petCharacteristics[1],
                    Sabor: product.specifications[0],
                    Peso: product.specifications[1],
                    Imagen: product.images[0]
                }));
    
                res.json({
                    mensaje: `Los productos que coinciden son:<br><hr> 
                    ${formattedProducts.map(p => `
                    - <strong>Marca:</strong> ${p.Marca}<br>
                    - <strong>Raza:</strong> ${p.Raza}<br>
                    - <strong>Categoria:</strong> ${p.Categoria}<br>
                    - <strong>Sabor:</strong> ${p.Sabor}<br>
                    - <strong>Peso:</strong> ${p.Peso}<br>
                    `).join('<hr>')}`,
                    image: `https://nutripet-healthy.up.railway.app/${formattedProducts[0].Imagen}`,
                });
            } else {
                res.json({ mensaje: 'No existen productos que coincidan con los criterios de búsqueda.' });
            }
        } else {
            res.json({ mensaje: 'No existen productos que coincidan con los criterios de búsqueda.' });
        }
    } catch (error) {
        console.error('Error al procesar la acción:', error);
        res.status(500).json({ error: 'Error al procesar la acción.' });
    }    
}

module.exports = router;