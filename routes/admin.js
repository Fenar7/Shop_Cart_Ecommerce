var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('admin/view-products', { products, admin:true });
  })
});

router.get('/add-product',(req,res)=>{
  res.render('admin/add-product')
})

router.post('/add-product', (req, res) => {
  productHelper.addProduct(req.body, (id) => {
      if (!id) {
          return res.status(500).send('Failed to add product')
      }

      if (!req.files || !req.files.Image) {
          return res.status(400).send('No image file uploaded')
      }

      let image = req.files.Image
      let imagePath = path.join(__dirname, '../public/product-images/', `${id}.png`)

      image.mv(imagePath, (err) => {
          if (err) {
              console.error('Error inserting image:', err)
              return res.status(500).send('Error inserting image')
          }
          res.render('admin/add-product')
      })
  })
})

module.exports = router;
