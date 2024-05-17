var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('index', { products, admin:true });
  })
});

module.exports = router;
