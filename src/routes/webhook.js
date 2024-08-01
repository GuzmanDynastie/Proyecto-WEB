const express = require('express');
require('dotenv').config({ path: __dirname + '../config/.env' });
const router = express.Router();
const productSchema = require('../models/product');
const orderSchema = require('../models/order');
const userSchema = require('../models/user');
const nodemailer = require('nodemailer');

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
            case 'orderInformation':
                await handleOrderInformation(req, res);
                break;
            case 'validateToken':
                await handleValidateToken(req, res);
                break;
            case 'sendEmail':
                await handleSendEmail(req, res);
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

        let query = {
            status: true,
            petCharacteristics: {
                $all: [petStage, petType, petRace]
            }
        };

        let products = await productSchema.find(query).lean();

        if (products.length === 0) {
            query.petCharacteristics = {
                $all: [petStage, petType, "Todos los tamaños"]
            };
            products = await productSchema.find(query).lean();
        }

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

            const productDetails = formattedProducts.map(product =>
                `
<hr style="border: 2px solid #ddd; width: 100%; margin: 10px 0;">
- <strong>Marca:</strong> ${product.Marca} <br>
- <strong>Raza:</strong> ${product.Raza} <br>
- <strong>Categoria:</strong> ${product.Categoria} <br>
- <strong>Sabor:</strong> ${product.Sabor} <br>
- <strong>Peso:</strong> ${product.Peso} <br><br>
<a href="https://nutripet-healthy.up.railway.app/shopping/shop/${product.ID_product}" target="_blank" title="Click para ver el producto" style="display: inline-block; border: 3px solid #ddd; padding: 3px; text-decoration: none; color: black;">
    <img src="https://nutripet-healthy.up.railway.app/${product.Imagen}" alt="${product.Marca}" style="width: 170px; object-fit: cover; border: 2px solid #ddd;">
</a><br><br>
            `).join('');

            res.json({
                mensaje: `<h4>Los productos que coinciden son:</h4><br>${productDetails}`
            });
        } else {
            res.json({ mensaje: 'No existen productos que coincidan con los criterios de búsqueda.' });
        }
    } catch (error) {
        console.error('Error al procesar la acción:', error);
        res.status(500).json({ error: 'Error al procesar la acción.' });
    }
}


// Funcion para validar si el token ingresado es valido
async function handleValidateToken(req, res) {
    const { token } = req.body;
    try {
        const order = await orderSchema.findOne({ token });
        if (!order) {
            return res.json({
                mensaje: "Orden no encontrada.",
                flag: "false",
            });
        }
        return res.json({
            mensaje: "Orden confirmada.",
            flag: "true",
        });
    } catch (error) {
        console.log("Error al validar la informacion.", error);
        return res.json({
            mensaje: "Error al validar la informacion.",
            flag: "false",
        });
    }
}


// Funcion para devolver la informacion si coincide el CODIGO
async function handleOrderInformation(req, res) {
    const { code } = req.body;

    try {
        if (code !== `NH-`) {
            return res.json({
                mensaje: "No ingresaste bien el código.",
                flag: "false"
            });
        }

        return res.json({
            mensaje: order.status_order,
            flag: "true"
        });

    } catch (error) {
        console.log("Error al validar la informacion.", error);
        return res.status(500).json({ mensaje: "Error al validar la informacion." });
    }
}


// Funcion para validar TOKEN y EMAIL
// async function handleSendEmail(req, res) {
//     const { token } = req.body;
//     const email = 'guzmanjrpro@gmail.com';

//     try {
//         const order = await orderSchema.findOne({ token });;
//         const user = await userSchema.findOne({ _id: order.id_user, email: email });
//         console.log(order.id_user);
//         console.log(user._id);
//         if (!user) {
//             return res.json({
//                 mensaje: "El email no corresponde a la orden ingresada.",
//                 flag: "false"
//             });
//         }

//         const randomCode = `NH-${generateRandomString(6)}`;
//         const emailResponse = await sendEmail(email, randomCode, res);
//         if (emailResponse.flag === "false") {
//             return res.status(500).json(emailResponse);
//         }

//     } catch (error) {
//         console.log("Error al validar la informacion.", error);
//         return res.status(500).json({ mensaje: "Error al validar la informacion." });
//     }
// }


// // Funcion para crear un codigo random de 6 caracteres
// function generateRandomString(length) {
//     return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
// }


// // Funcion para enviar el codigo al email ingresado
// async function sendEmail(email, randomCode, res) {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.APP_PASSWORD_GMAIL
//         }
//     });

//     let mailOptions = {
//         from: `NutriPet Healthy <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: 'Codigo para validar TOKEN',
//         html: `Ingresa este codigo en el chatbot: <strong><h3>${randomCode}</h3></strong>`
//     }

//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log({ mensaje: `Correo enviado a: ${info.accepted}, con el codigo: ${randomCode}` });
//         return res.json({
//             mensaje: "Se ha enviado el correo exitosamente.",
//             flag: "true"
//         });

//     } catch (error) {
//         console.log('Ha ocurrido un error al tratar de enviar el correo', error);
//         return res.status(500).json({
//             mensaje: "Ha ocurrido un error al tratar de enviar el correo.",
//             flag: "false"
//         });
//     }
// }



async function handleSendEmail(req, res) {
    const email = 'guzmanjrpro@gmail.com';

    try {
        const randomCode = `NH-${generateRandomString(6)}`;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.APP_PASSWORD_GMAIL
            }
        });

        let mailOptions = {
            from: `NutriPet Healthy <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Código para validar TOKEN',
            html: `Ingresa este código en el chatbot: <strong><h3>${randomCode}</h3></strong>`
        };

        let info = await transporter.sendMail(mailOptions);
        console.log({ mensaje: `Correo enviado a: ${info.accepted}, con el código: ${randomCode}` });
        return res.json({
            mensaje: "Se ha enviado el correo exitosamente.",
            flag: "true"
        });
    } catch (error) {
        console.log('Ha ocurrido un error al tratar de enviar el correo o validar la información', error);
        return res.status(500).json({
            mensaje: "Ha ocurrido un error al tratar de enviar el correo o validar la información.",
            flag: "false"
        });
    }
}


function generateRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

// async function sendEmail(email, randomCode, res) {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.APP_PASSWORD_GMAIL
//         }
//     });

//     let mailOptions = {
//         from: `NutriPet Healthy <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: 'Codigo para validar TOKEN',
//         html: `Ingresa este codigo en el chatbot: <strong><h3>${randomCode}</h3></strong>`
//     }

//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log({ mensaje: `Correo enviado a: ${info.accepted}, con el codigo: ${randomCode}` });
//         return {
//             mensaje: "Se ha enviado el correo exitosamente.",
//             flag: "true"
//         };

//     } catch (error) {
//         console.log('Ha ocurrido un error al tratar de enviar el correo', error);
//         return {
//             mensaje: "Ha ocurrido un error al tratar de enviar el correo.",
//             flag: "false"
//         };
//     }
// }


module.exports = router;