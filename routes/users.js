var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers')
const path = require('path');
const { Console } = require('console');

//middleware

const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}


/* GET home page. */
router.get('/',async function(req, res, next) {
  let user = req.session.user
  let cartCount = null
  if(req.session.user){
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/index', { products, admin:false, user, cartCount });
  })
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login', {loginErr : req.session.loginErr})
    req.session.loginErr = false
  }
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
    userHelpers.doSignup(req.body).then((response)=>{
      console.log(response)
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user = response.user
      res.redirect('/')
    }else{
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,async (req,res)=>{
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let totalValue = await userHelpers.getTotalAmount(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products,user:req.session.user._id,totalValue})
})

router.get('/add-to-cart/:id', verifyLogin, (req, res) => {
  console.log('API call to add product to cart');
  res.json({ status: true });
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
      console.log('Product added to cart');
  }).catch((err) => {
      console.error('Error adding product to cart:', err);
      res.json({ status: false });
  });
});

router.post('/change-product-quantity/',(req,res,next)=>{
  userHelpers.changeProductQuantity(req.body).then(async (response)=>{
    response.total = await userHelpers.getTotalAmount(req.body.user)
    res.json(response)
  })
})

router.post('/delete-product-item',(req,res,next)=>{
  userHelpers.deleteItemCart(req.body).then((response)=>{
    res.json(response)
  })
})

router.get('/place-order',verifyLogin,async (req,res)=>{
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user})
})

router.post('/place-order',async (req,res)=>{
  console.log(req.body)
  let products = await userHelpers.getCartProductList(req.body.userId)
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice).then((response)=>{

})
  console.log(req.body)
})

module.exports = router;
