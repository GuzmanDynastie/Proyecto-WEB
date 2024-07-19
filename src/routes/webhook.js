const express = require('express');
const router = express.Router();
const productSchema = require('../models/product');
const axios = require('axios');

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
            case 'recomendationProduct':
                await handleRecomendationProduct(req, res);
                break;
            default:
                res.status(400).json({ error: 'Accion no reconocida.' });
        }

    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
});

// Funcion para consultar si una marca existe o no en la BD
async function handleCheckBrand(req, res) {
    try {
        const { marca: nameBrandSolicited } = req.body;
        const productsInBD = await productSchema.find({ status: true });
        const brandExists = productsInBD.some(product => {
            return product.generalCharacteristics.includes(nameBrandSolicited);
        });

        if (brandExists) {
            res.json({ mensaje: `¡Por supuesto! Actualmente contamos con la marca <Strong>${nameBrandSolicited}</Strong>.` });
        } else {
            res.json({ mensaje: `Lo sentimos, actualmente no disponemos de la marca <Strong>${nameBrandSolicited}</Strong>.` });
        }

    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
}

// Funcion para hacer un filtro de busqueda con los parametros: MARCA, RAZA y ETAPA
async function handleDetailsProduct(req, res) {
    try {
        const { marca: nameBrandSolicited, raza: breedSolicited, etapa: petStage } = req.body;

        const productsInBD = await productSchema.find();
        const brandExists = productsInBD.some(product => {
            return product.generalCharacteristics[1].toLowerCase().includes(nameBrandSolicited.toLowerCase());
        });

        let query = { status: true };

        if (nameBrandSolicited && breedSolicited && petStage) {
            const searchTerms = [nameBrandSolicited, breedSolicited, petStage];
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
                    Imagen: product.images[0],
                    ID_product: product._id
                }));

                res.json({
                    mensaje: `Los productos que coinciden son:<br><hr> 
                    - <strong>Marca:</strong> ${formattedProducts[0].Marca}
                    - <strong>Raza:</strong> ${formattedProducts[0].Raza}
                    - <strong>Categoria:</strong> ${formattedProducts[0].Categoria}
                    - <strong>Sabor:</strong> ${formattedProducts[0].Sabor}
                    - <strong>Peso:</strong> ${formattedProducts[0].Peso}`,
                    image: `https://nutripet-healthy.up.railway.app/${formattedProducts[0].Imagen}`,
                    url: `https://nutripet-healthy.up.railway.app/shopping/shop/${formattedProducts[0].ID_product}`
                });
            }
        } else {
            res.json({ mensaje: 'No existen productos que coincidan con los criterios de búsqueda.' });
        }
    } catch (error) {
        console.error('Error al procesar la acción:', error);
        res.status(500).json({ error: 'Error al procesar la acción.' });
    }
}

// Funcion quer muestra la recomendacion de productos con ETAPA, MASCOTA y RAZA
async function handleRecomendationProduct(req, res) {
    try {
        const { etapa: petStage, mascota: petType, raza: petRace } = req.body;

        // Inicializa la consulta con los parámetros proporcionados
        let query = {
            status: true,
            petCharacteristics: {
                $all: [petStage, petType, petRace]
            }
        };

        // Busca los productos que coinciden con la consulta
        let products = await productSchema.find(query).lean();

        // Si no se encuentran productos, ajusta la consulta y vuelve a buscar
        if (products.length === 0) {
            query.petCharacteristics = {
                $all: [petStage, petType, "Todos los tamaños"]
            };
            products = await productSchema.find(query).lean();
        }

        // Si se encuentran productos, formatea los detalles para la respuesta
        if (products.length > 0) {
            const formattedProducts = products.map(product => ({
                Marca: product.generalCharacteristics[1] || 'Desconocida',
                Raza: product.petCharacteristics[0] || 'Desconocida',
                Categoria: product.petCharacteristics[1] || 'Desconocida',
                Sabor: product.specifications[0] || 'Desconocido',
                Peso: product.specifications[1] || 'Desconocido',
                Imagen: product.images[0] || '',
                ID_product: product._id
            }));

            // Construye los detalles de los productos incluyendo imagen y URL
            const productDetails = formattedProducts.map(product =>
                `
<hr>
- <strong>Marca:</strong> ${product.Marca} <br>
- <strong>Raza:</strong> ${product.Raza} <br>
- <strong>Categoria:</strong> ${product.Categoria} <br>
- <strong>Sabor:</strong> ${product.Sabor} <br>
- <strong>Peso:</strong> ${product.Peso} <br>
<a href="https://nutripet-healthy.up.railway.app/shopping/shop/${product.ID_product}" target="_blank">
    <img src="https://nutripet-healthy.up.railway.app/${product.Imagen}" alt="${product.Marca}" style="width: 170px; object-fit: cover;">
</a><br>
            `).join('');

            res.json({
                mensaje: `<h3>Los productos que coinciden son:</h3><br>${productDetails}`
            });
        } else {
            res.json({ mensaje: 'No existen productos que coincidan con los criterios de búsqueda.' });
        }
    } catch (error) {
        console.error('Error al procesar la acción:', error);
        res.status(500).json({ error: 'Error al procesar la acción.' });
    }
}

module.exports = router;