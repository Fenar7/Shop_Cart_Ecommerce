const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt')
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
                    .updateOne({'products.item':new objectId(proId)},
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
            console.log(cartItems[0].products)
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
    }
};
