const path = require('path');                                 // Core Module
const getDb = require('./util/database').getDB                // Bring in database export to confirm database connection exists

const express = require('express');                           // Bring in Express for handling router Object              
const bodyParser = require('body-parser');                    // Express tool to process data sent in HTTP requests

const errorController = require('./controllers/error');       // CONTROLLER used for Catching any requests not defined in routes folder

const mongoConnect = require('./util/database').mongoConnect; // Bring in MongoDB connections

const User = require('./models/user');                        // Bring in User Model

const app = express();                                        // CREATE AN EXPRESS APP

// CONGIGURE EXPRESS APPLICATION SETTINGS (https://expressjs.com/en/api.html) 
app.set('view engine', 'ejs');                                // Set the view engine setting to read ejs files
app.set('views', 'views');                                    // Set the view setting to read from the 'views' directory

// BRING IN ROUTES
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));          // MIDDLEWARE parses http request data and creates a 'Body' object
app.use(express.static(path.join(__dirname, 'public')));      // MIDDLEWARE for using static files in the 'public' directory such as CSS files


// MIDDLEWARE for obtaining the user so that all information done within app is associated with a USER
app.use((req, res, next) => {
  // HELP Code for fetching all users and deleting them:
  // db = getDb()
  // // db.collection('users').deleteMany()
  // db.collection('users').find().toArray().then(users =>{
  //   console.log(users[0].cart)
  // })
 

  User
    .findById('65ba5a59ef741940a804417f')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      // console.log(req.user)
      next()
    })
    .catch(err => console.log(err));
});


// MIDDLEWARE for USING ROUTE FILES
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// MIDDLEWARE FOR CATCHING ALL HTTP REQUEST NOT ASSIGNED IN ROUTES MENTIONED ABOVE
app.use(errorController.get404);


// CONNECT TO DATABASE AND TELL DB TO LISTEN TO LOCALHOST: 3000
mongoConnect(client => {
  //Create a new user for testing
  // newUser = new User('willBilly', 'willBilly@bill.com', {items: []} ).save()
  app.listen(3000);
});
