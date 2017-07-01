console.log('Starting server');

//require modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');

//require files
const config = require('./config.js')

//establish connection with database
const connectionString = 'postgres://postgres:Testies1-1@localhost/jacobhamblin';
const db = massive.connectSync({
  connectionString: connectionString
})

//create session
app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true
}));

//set port for app to listen
const port = 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))

//create an item in the database which takes user input from the web page and their user email from the session
app.post('/api/list', function (req, res) {
  db.create_item([req.body.item, req.session.user], function (err, success) {
    (err) ? res.status(500).json(err) : res.status(200).json('success')
  })
})

//see all the items in the users list based off session user email
app.get('/api/list', function (req, res) {
  db.see_names([req.session.user], function (err, item) {
    (err) ? res.status(500).json(err) : res.status(200).json(item)
  })
})

//remove item based on the ID of database entry
app.delete('/api/list/:id', function (req, res) {
  db.remove_name([req.params.id], function(err, id) {
    (err) ? res.status(500).json(err) : res.status(200).json(id)
  })
})

//change an item based off its ID and the user input
app.put('/api/listupdate', function(req, res) {
  db.change_name([req.body.id, req.body.item], function(err, response){
    (err) ? res.status(500).json(err) : res.status(200).json(response)
  })
})

//create a new user based on user input from web page. First the web app checks the database to make sure the email is not already used and then creates the user
app.post('/api/create_user', function(req, res) {
  db.create_user([req.body.email, req.body.password], function(err, response) {
    req.session.user = req.body.email;
    (err) ? res.status(500).json(err) : res.status(200).json(response)
  })
})

//this is for logging in to an already created user. The email and password from the web app are sent to the database and return a response if there is a match
app.post('/api/check_user', function(req, res) {
  db.check_user([req.body.email, req.body.password], function(err, response) {
    if (!err) {
      req.session.user = req.body.email
      res.status(200).json(response)
    }
    else if (err) {
      res.status(500).json(err) 
    } 
  })
})

app.post('/api/change_password', function(req, res) {
  db.check_password([req.body.oldPass, req.session.user], function(err,response) {
    if (!err) {
      db.set_new_pass([req.body.newPass, req.session.user], function(err, response) {
        console.log('password has been changed to ' + req.body.newPass)
      })
    }
  })
})

//this is made to simply check who the user is in case of page reload, etc.
app.get('/api/see_user', function(req, res) {
  res.status(200).json(req.session.user)
})

//logout removes the user off of session
app.post('/api/logout', function(req, res) {
  req.session.user = null;
  res.status(200).json(req.session.user)
})

app.listen(port, function () {
  console.log('Listening on port ' + port)
})