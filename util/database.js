// IMPORT MONGO DB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;    //CONNECT TO MONGO DB

let _db;

// Mongo Stuff:
// https://cloud.mongodb.com/v2/65b7e2a87ff97a39892e219d#/overview
// username: billabrown90
// password: An2yZqRdZsubpv19

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://billabrown90:An2yZqRdZsubpv19@cluster0.qbvkp7g.mongodb.net/shop?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then(client => {
    console.log('Connected!');    //Lets us know if connection was successful
    _db = client.db()     //This connects to the /shop db in client url above
    callback(client);
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

// If Database already exists, return it
const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
}


exports.mongoConnect = mongoConnect;
exports.getDB = getDB;      // Checks to see if connection to database currently exists or not.
