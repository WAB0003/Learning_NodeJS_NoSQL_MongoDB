const mongodb = require('mongodb');               // Bring in MongoDB driver
const getDb = require('../util/database').getDB;  // Bring in database export method for making db connection

// CREATE PRODUCT MODEL
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null ;   // If id is provided, make sure its a mongodb ObjectId, otherise don't give it an id
    this.userId = userId;
  }


//SAVE METHOD
  save() {
    // CONNECT TO DATABASE
    const db = getDb();
    let dbOp;

    // IF Id is provided when being saved, then we update the product (updateOne), else, we create a new one (insertOne)
    // See CRUD options in Docs: https://www.mongodb.com/docs/manual/crud/
    if (this._id) {
      //Update Product
      dbOp = db.collection('products').updateOne( {_id: this._id} , { $set: this }) // update entire product item to new instance

    } else {
      //Create New Product
      dbOp = db.collection('products').insertOne(this) //if it doesn't exist already, thi is where mongo creates an id for it in db
    }
     return dbOp
      // .then(result => console.log(result))
      .catch(err=>console.log(err))
  }

  // STATIC (CLASS) METHODS
  // FETCH ALL INSTANCES OF EACH PRODUCT
  static fetchAll() {
    const db = getDb()
    return db
      .collection('products') 
      .find()                           //mongodb method that returns a cursor (not a PROMISE!!!)
      .toArray()                        //curors are pointers that point to the result. 
      .then(products => {
        // console.log(products)
        return products
      })
      .catch(err=>console.log(err));
  }

  // FETCH PRODUCT BY ID
  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) }) //Because MONGO is technically BSON, the id created by mongo is Binary and known as an ObjectID. 
      .next()   //next resolves cursor from .find() method
      .then(product => {
        // console.log(product);
        return product
      }).catch(err=>console.log(err))
  }

  // DELETE PRODUCT
  static deleteById(prodId){
    const db = getDb()
    return db
    .collection('products')
    .deleteOne( { _id: new mongodb.ObjectId(prodId) } )
    .then(result => {
      console.log('Deleted')
    })
    .catch(err=>console.log(err))
  }
}

module.exports = Product;
