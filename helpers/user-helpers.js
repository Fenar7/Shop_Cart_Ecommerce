const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { response } = require('express');
var objectId = require('mongodb').ObjectId

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                userData.Password = await bcrypt.hash(userData.Password, 10);
                db.get().collection(collection.USER_COLLECTION).insertOne(userData)
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } catch (err) {
                reject(err);
            }
        });
    },

    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log('login success')
                        response.user = user
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed')
                resolve({status:false})
            }
        })
    },

    addToCart:(proId,userId)=>{
        let proObj={
            item:new objectId(proId),
            quantity:1
        }
        return new Promise(async (resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:new objectId(userId)})
            if(userCart){
                console.log(userCart.products.map(product => product));
                let proExist = userCart.products.findIndex(product=>product.item==proId)
                console.log(proExist)
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:new objectId(userId),'products.item':new objectId(proId)},
                    {
                        $inc:{'products.$.quantity':1}
                    }
                ).then(()=>{
                    resolve()
                })
                }else{
                    await db.get().collection(collection.CART_COLLECTION) 
                    .updateOne(
                        { user: new objectId(userId) },
                        { 
                            $push: {products:proObj} 
                        }
                    ).then((response)=>{
                        resolve()
                    });
                }
            console.log('Product added to cart successfully.');
            }else{
                let cartObj = {
                    user: new objectId(userId),
                    products: [proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },

    getCartProducts:(userId)=>{
        return new Promise(async (resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:new objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PROUDUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }
                // {
                //     $lookup:{
                //         from:collection.PROUDUCT_COLLECTION,
                //         let:{proList:'$products'},
                //         pipeline:[
                //             {
                //                 $match:{
                //                     $expr:{
                //                         $in:['$_id',"$$proList"]
                //                     }
                //                 }
                //             }
                //         ],

                //         as:'cartItems'
                //     }
                // }
            ]).toArray()
            resolve(cartItems)
        })
    },

    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:new objectId(userId)})
            if (cart){
                count = cart.products.length
            }
            resolve(count)
        })
    },

    changeProductQuantity:(details)=>{
        details.count = parseInt(details.count)
        details.quantity = parseInt(details.quantity)
        console.log('increment fn triggered')
        return new Promise((resolve,reject)=>{
            console.log("details count ="+details.count)
            console.log("details quantity ="+details.quantity)
            if(details.count==-1 && details.quantity==1){
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:new objectId(details.cart)},
                    {
                        $pull:{products:{item:new objectId(details.product)}}
                    }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })
            }else{
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:new objectId(details.cart),'products.item':new objectId(details.product)},
                    {
                        $inc:{'products.$.quantity':details.count}
                    }
                ).then((response)=>{
                    resolve({status:true})
                })
            }
        })
    },

    deleteItemCart:(details)=>{
        console.log('delete function triggered')
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION)
                    .updateOne({_id:new objectId(details.cart)},
                    {
                        $pull:{products:{item:new objectId(details.product)}}
                    }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })
        })
    },
     
    getTotalAmount:(userId)=>{
       return new Promise(async (resolve,reject)=>{
        let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{user:new objectId(userId)}
            },
            {
                $unwind:'$products'
            },
            {
                $project:{
                    item:'$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup:{
                    from:collection.PROUDUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
            },
            {
                $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                }
            },
            {
                $group:{
                    _id:null,
                    total: {
                        $sum: {
                            $multiply: [
                                { $toDouble: '$quantity' },
                                { $toDouble: '$product.Price' }
                            ]
                        }
                    }
                }
            }
        ]).toArray()
        console.log('total array')
        console.log(total)
        resolve(total[0].total)
       })
    },

    placeOrder:(order,products,total)=>{
        return new Promise((resolve,reject)=>{
            console.log(order,products,total)
        })
    },

    getCartProductList:(userId)=>{
        return new Promise(async (resolve,reject)=>{
            console.log(userId)
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:new objectId(userId)})
            console.log(cart)
            resolve(cart.products)
        })  
    }
};
