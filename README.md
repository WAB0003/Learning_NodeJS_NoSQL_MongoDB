# Learning_NodeJS_NoSQL_MongoDB
Great notes resource with notes on using MongoDB (NoSQL) to build Node.js app.

# Getting Started:
To start app, run the following command
```npm install```

Open up browser and type 'http://localhost:3000/'

# Notes:
The following information was documented throughout so that similar start could be mimicked.
## Definitions:
- **Node.js**
  - a runtime environment for building server-side and networking applications
- **Express.js**
  - Node.js web application framework
  - Great for building out 'routes' for API
- **MongoDB**
  - A NoSQL database management program
  - Used for high-volume data storage
- **NoSQL**
  - Instead of using relational databases with tables and rows (SQL), NoSQL db's are made up of *collections* and *documents*
  - *Collections* are the equivalent of SQL tables. Each *collection* contain *Document* sets.
  - *Documents* are made up of 'key-value' pairs.
- **MVC**
  - Model View Controller - A pattern in software design commonly used
- **Templating Engine**
  - EJS, PUG, etc...
  - Allows you to use placeholders for dynamic content that will be replaced with actual data when a page is rendered

## Initial Setup of a express application
1. **MongoDB**
   Application uses MongoDB. Must create a MongoDB Account (https://account.mongodb.com/account/login)

   Set up free Cluster() for Connction. Make sure to remember the following information:
   - Make sure to record you username & password for building out ./util/database.js file
   - This information, as well as the mongoDB *Connection String* will be required


3. Create a npm project and install Express.js (nodemon if you want)
    - run ```npm init``` to initialize npm project and get package.json file
    - run ```npm install --save-dev nodemon``` to get nodemon package
    - run ```npm install express```
    - run ```npm install body-parser```
    - run ```npm install ejs```
    - run ```npm install --save mongodb```    this will install driver

    Once all dependenices have been installed, update 'start' script in package.json file
        "start": "nodemon app.js"
    run npm install and then use npm start to start connection to server

    Once setup is complete, create app.js file and bring in desired CORE modules, NPM modules, and connect to express server

    Set global configuration values for dealing with static css documents and EJS

    Use body-parser as a Middleware that parses incoming request data before they get sent to Handlers

4. Congigure DB (reference ./util/database.js)
   - To configure DB, make sure to record your username, password, and connection string when you set up a mongdoDB cluster().
   - This file will contain (2) exports:
    1. a MongoDB Client Connection callback function
    2. a callback function for returning client connection if it already exists

5. Transform app to an Express.js app and set up routing:
    - Create a routes directory for handlers
    - In handler JS files, do the following:
        - path core modules
        - bring in express
        - create router Object using express.router
        - user Router Object to create routes for different requests (get, posts, etc.)
        - use res.render() to render an EJS page.
     
6. CREATE MVC FILES
     
  
