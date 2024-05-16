var db = require('../config/connection')

module.exports = {
    addProduct: (product, callback) => {
        console.log(product);
        db.get().collection('product').insertOne(product)
            .then((data) => {
                console.log(data)
                callback(data.insertedId);
            })
            .catch((err) => {
                console.error("Error occurred while adding product:", err);
                callback(false); // Invoke callback with false to indicate failure
            });
    }
}
