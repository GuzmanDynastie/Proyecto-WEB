const router = require('express').Router();
const product = require('../models/product')

router.get('/chatbot/productos', async (req, res) => {
  const products= await product.find();
  res.json(products);
});

module.exports = router;