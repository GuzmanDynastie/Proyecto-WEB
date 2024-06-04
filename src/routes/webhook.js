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

async function handleDetailsProduct(req, res) {
    try {
        const { marca: nameBrandSolicited, raza: breedSolicited, etapa: petStage } = req.body;

        const productsInBD = await productSchema.find();
        const brandExists = productsInBD.some(product => product.generalCharacteristics.includes(nameBrandSolicited));

        let query = { status: true };

        if (nameBrandSolicited && breedSolicited && petStage) {
            const searchTerms = [nameBrandSolicited.trim(), breedSolicited.trim(), petStage.trim()];
            const orConditions = searchTerms.map(term => ({
                $or: [
                    { 'petCharacteristics.0': { $regex: new RegExp(term, 'i') } },
                    { 'petCharacteristics.1': { $regex: new RegExp(term, 'i') } },
                    { 'generalCharacteristics.1': { $regex: new RegExp(term, 'i') } }
                ]
            }));
            query.$and = orConditions;
        }

        let products = [];

        if (brandExists) {
            products = await productSchema.find(query).lean();
        }

        if (products.length > 0) {
            const formattedProducts = products.map(product => ({
                Marca: product.generalCharacteristics[1],
                Raza: product.petCharacteristics[0],
                Categoria: product.petCharacteristics[1],
                Sabor: product.specifications[0],
                Peso: product.specifications[1],
                Imagen: product.images[0]
            }));

            let mensaje = 'Los productos que coinciden son:<br><hr>';
            formattedProducts.forEach(product => {
                mensaje += `
                    - <strong>Marca:</strong> ${product.Marca}<br>
                    - <strong>Raza:</strong> ${product.Raza}<br>
                    - <strong>Categoria:</strong> ${product.Categoria}<br>
                    - <strong>Sabor:</strong> ${product.Sabor}<br>
                    - <strong>Peso:</strong> ${product.Peso}<br><hr>
                `;
            });

            res.json({
                mensaje: mensaje,
                image: `https://nutripet-healthy.up.railway.app/${formattedProducts[0].Imagen}`
            });
        } else {
            const alternativeQuery = {
                status: true,
                'petCharacteristics.0': { $regex: new RegExp(breedSolicited, 'i') },
                'petCharacteristics.1': { $regex: new RegExp(petStage, 'i') }
            };

            const alternativeProducts = await productSchema.find(alternativeQuery).lean();

            if (alternativeProducts.length > 0) {
                const formattedAlternativeProducts = alternativeProducts.map(product => ({
                    Marca: product.generalCharacteristics[1],
                    Raza: product.petCharacteristics[0],
                    Categoria: product.petCharacteristics[1],
                    Sabor: product.specifications[0],
                    Peso: product.specifications[1],
                    Imagen: product.images[0]
                }));

                let mensaje = 'No se encontraron productos de la marca solicitada, pero estos productos coinciden con la raza y etapa:<br><hr>';
                formattedAlternativeProducts.forEach(product => {
                    mensaje += `
                        - <strong>Marca:</strong> ${product.Marca}<br>
                        - <strong>Raza:</strong> ${product.Raza}<br>
                        - <strong>Categoria:</strong> ${product.Categoria}<br>
                        - <strong>Sabor:</strong> ${product.Sabor}<br>
                        - <strong>Peso:</strong> ${product.Peso}<br><hr>
                    `;
                });

                res.json({
                    mensaje: mensaje,
                    image: `https://nutripet-healthy.up.railway.app/${formattedAlternativeProducts[0].Imagen}`
                });
            } else {
                res.json({ mensaje: 'No existen productos que coincidan con los criterios de búsqueda.' });
            }
        }
    } catch (error) {
        console.error('Error al procesar la acción:', error);
        res.status(500).json({ error: 'Error al procesar la acción.' });
    }
}

module.exports = router;