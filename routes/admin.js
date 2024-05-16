var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"iphone 15 PRO max",
      category: "mobile",
      description: "This is a good phone",
      image: "https://www.reliancedigital.in/medias/Apple-iPhone-15-Pro-Max-Mobile-Phone-493839356-i-1-1200Wx1200H?context=bWFzdGVyfGltYWdlc3wxNzk5NjZ8aW1hZ2UvanBlZ3xpbWFnZXMvaGEyL2gzOS8xMDA1MjAxNDYzNzA4Ni5qcGd8NjFkZWI3ZTE1MDQ5MmY1Zjk2NWQ3MjA3NmYzYzcwYjJjYWVkNTJlZjRiZDRhMTBkZmJkZjkwMzljOThiZDk5NA"
    },

    {
      name:"iphone 15",
      category: "mobile",
      description: "This is a good phone",
      image: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1708674029/Croma%20Assets/Communication/Mobiles/Images/300665_0_vveh9a.png?tr=w-600"
    },

    {
      name:"iphone 14 PRO MAX",
      category: "mobile",
      description: "This is a good phone",
      image: "https://images-cdn.ubuy.co.in/633ff4156784f756b5031314-iphone-14-pro-max-256gb-gold.jpg"
    },

    {
      name:"iphone 14",
      category: "mobile",
      description: "This is a good phone",
      image: "https://www.maplestore.in/cdn/shop/files/iPhone_14_Midnight_PDP_Image_Position-1A__WWEN_d558c66e-6f07-4ee1-b7d7-a3e893d18c2c_823x.jpg?v=1701815642"
    }
  ]
  res.render('admin/view-products', { products, admin:true });
});

router.get('/add-product',(req,res)=>{
  res.render('admin/add-product')
})

router.post('/add-product',(req,res)=>{
  // console.log(req.body)
  // if (!req.files || !req.files.Image) {
  //   console.log('No file uploaded');
  // } else {
  //   // Log details of the uploaded file
  //   console.log(req.files.Image);
  // }
  productHelper.addProduct(req.body,(result)=>{
    res.render('admin/add-prodcut')
  })
})

module.exports = router;
