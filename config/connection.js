const MongoClient = require('mongodb').MongoClient
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);
const state = {
    db: null
}

module.exports.connect = (done) => {
    const dbname = 'shopping'
    state.db = client.db(dbname)
        
    done()
}

module.exports.get = function () {
    return state.db
}
