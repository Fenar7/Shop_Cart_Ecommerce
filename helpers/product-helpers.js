const db = require('../config/connection');
const collection = require('../config/collections');
const objectId = require('mongodb').ObjectId

module.exports = {
    addProduct: (product, callback) => {
        console.log(product);
        db.get().collection('product').insertOne(product)
            .then((data) => {
                console.log(data);
                callback(data.insertedId);
            })
            .catch((err) => {
                console.error("Error occurred while adding product:", err);
                callback(false); // Invoke callback with false to indicate failure
            });
    },

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let products = await db.get().collection(collection.PROUDUCT_COLLECTION).find().toArray();
                resolve(products);
            } catch (error) {
                reject(error);
            }
        });
    },

    deleteProduct: (proId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PROUDUCT_COLLECTION).deleteOne({ _id: new objectId(proId) })
                .then((response) => {
                    console.log(response);
                    resolve(response);
                })
                .catch((err) => {
                    console.error("Error occurred while deleting product:", err);
                    reject(err);
                });
        });
    },

    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PROUDUCT_COLLECTION).findOne({_id:new objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PROUDUCT_COLLECTION).updateOne({_id:new objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Category:proDetails.Category,
                    Price:proDetails.Price,
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    }
};
