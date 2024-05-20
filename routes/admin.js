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
          res.render('admin/add-product',{admin:true})
      })
  })
})

router.get('/delete-product/:id',(req,res)=>{
    let proId = req.params.id
    console.log(proId)
    productHelpers.deleteProduct(proId).then((response)=>{
      res.redirect('/admin/',{admin:true})
    })
})

router.get('/edit-product/:id',(req,res)=>{
  let product = productHelpers.getProductDetails(req.params.id).then((product)=>{
    console.log(product)
    res.render('admin/edit-prodcut.hbs',{product})
  })
})

router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let id = req.params.id
      let image= req.files.Image
      let imagePath = path.join(__dirname, '../public/product-images/', `${id}.png`)
      image.mv(imagePath, (err) => {
        if (err) {
            console.error('Error Updating image:', err)
            return res.status(500).send('Error updating image')
        }
    })
    }
  })
})


module.exports = router;
