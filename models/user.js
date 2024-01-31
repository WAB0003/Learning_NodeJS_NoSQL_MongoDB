const mongodb = require('mongodb');               // Bring in MongoDB driver
const getDb = require('../util/database').getDB;  // Bring in database export method for making db connection

// Shortcut for converting strings 'ids' into mongoDb type Id's
const ObjectId = mongodb.ObjectId;

// CREATE USER MODEL
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  //SAVE METHOD
  save() {
    const db = getDb();      // check connection and return it
    
    return db
    .collection('users')    // access user collection in MongoDB database
    .insertOne(this)
  }

  // ADD TO CART
  addToCart(product) {
    // FIRST, FIND IF PRODUCT ALREADY EXISTS USER.CART.ITEMS
    const cartProductIndex = this.cart.items.findIndex( cp => {
      return cp.productId.toString() === product._id.toString()
    });

    let newQuantity = 1
    const updatedCartItems = [...this.cart.items];  // make a copy of original cart

    // USE INDEX. IF PRODUCT EXISTS --> UPDATE current quantity
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    // IF PRODUCT DOESN'T EXIST, ADD TO CART AND BEGIN QTY OF 1
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id), 
        quantity: newQuantity 
      });
    }

    // Update cart items
    const updatedCart = {
      items: updatedCartItems          // updates a product to have a quantity attribute
    }

    // Get User from DB and Update Cart.
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
      { _id: new ObjectId(this._id) },
      {$set: {cart: updatedCart}} 
    );
  }


  // FETCH CART
  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => item.productId)
    return db
      .collection('products')
      .find({_id: {$in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return {...p, 
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        })
      });
  }

  // DELETE PRODUCT FROM A CART
  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        {$set: { cart: {items: updatedCartItems} } }
      )
  }

  // REMOVE ITEMS FROM A CART AND CREATE AN ORDER
  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name
          }
        };
        return db
          .collection('orders')         // Add cart to 'Orders' collection (this will create a orders collection.)
          .insertOne(order)     
      })
      .then(result => {
        this.cart = { items: [] };      //empty cart and then update database

        return db                     // Now empty cart in database
        .collection('users')
        .updateOne(
          { _id: new ObjectId(this._id) },
          {$set: { cart: {items: []} } }
        )
      })
  }

  // METHOD TO VIEW ORDERS
  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray();
  }


  //Static methods are for the CLASS as a WHOLE
  static findById(userId) {
    const db = getDb();
    return db.collection('users').find({_id: new ObjectId(userId)}).next().catch(err=>console.log(err));
  }
}


module.exports = User;
