const db = require('../config/connection');
const collection = require('../config/collections');

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
    }
};
