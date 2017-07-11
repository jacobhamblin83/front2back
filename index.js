console.log('Starting server');

//require modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');

//require files
const config = require('./config.js')

//establish connection with database (locally)
// const connectionString = 'postgres://postgres:Testies1-1@localhost/jacobhamblin';

//changed to a hosted database
const connectionString = config.connectionString;

const db = massive.connectSync({
    connectionString,
})

//create session
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

//set port for app to listen
const port = 3500;

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))

//create an item in the database which takes user input from the web page and their
//user email from the session
app.post('/api/list', (req, res) => {
    let input = req.body.userInput
    let date = req.body.date
    let user = req.session.user
    db.create_item([input, date, user], (err, success) => {
        err ? 
        res.status(500).json(err) : 
        res.status(200).json('success')
    })
})

//see all the items in the users list based off session user email
//this will include any friends that the user has in the friends table
app.get('/api/list', (req, res) => {
    db.see_items(req.session.user, (err, item) => {
        err ? 
        res.status(500).json(err) : 
        res.status(200).json(item)
    })
})

//remove item based on the ID of database entry
app.delete('/api/list/:id', (req, res) => {
    db.remove_item(req.params.id, (err, id) => {
        err ? 
        res.status(500).json(err) : 
        res.status(200).json(id)
    })
})

//change an item based off its ID and the user input
app.put('/api/listupdate', (req, res) => {
    let id = req.body.id
    let item = req.body.item
    db.change_item([id, item], (err, response) => {
        err ? 
        res.status(500).json(err) : 
        res.status(200).json(response)
    })
})

//create a new user based on user input from web page. First the web app checks the
//database to make sure the email is not already used and then creates the user
app.post('/api/create_user', (req, res) => {
    let name = req.body.createName
    let email = req.body.email
    let pass = req.body.password
    db.create_user([name, email, pass], (err, response) => {
        if (!err) {
            req.session.user = email;
            req.session.firstname = name;
            res.status(200).json(response);
        }
        else res.status(500).json(err); 
    })
    //adding yourself as a friend since what you see is based on your friends
    db.add_friend([email, email], (err, response) => {
        err ?
        res.status(500).json(err) :
        res.status(200).json(response)
    })
})

app.post('/api/add_friend', (req, res) => {
    let user = req.session.user
    let friend = req.body.friend
    db.add_friend([user, friend], (err, response) => {
        err ?
        res.status(500).json(err) :
        res.status(200).json(response)
    })
})

app.delete('/api/friends/:id', (req, res) => {
    db.remove_friend(req.params.id, (err, id) => {
        err ? 
        res.status(500).json(err) : 
        res.status(200).json(id)
    })
})

app.post('/api/see_friends', (req, res) => {
    db.see_friends(req.session.user, (err, response) => {
        err ?
        res.status(500).json(response) :
        res.status(200).json(response)
    })
})

//this is for logging in to an already created user. The email and password from
//the web app are sent to the database and return a response if there is a match
app.post('/api/check_user', (req, res) => {
    let email = req.body.email
    let pass = req.body.password
    db.check_user([email, pass], (err, response) => {
        if (!err) {
            req.session.user = req.body.email
            res.status(200).json(response)
        }
        else if (err) {
            res.status(500).json(err) 
        } 
    })
})

//change password checks if the password is correct for the user on req.session and
//then if that is correct then it updates the password on the database to the new 
//password provided

app.post('/api/change_password', (req, res) => {
    let user = req.session.user
    let pass = req.body.oldPass
    let newPass = req.body.newPass
    db.check_password([pass, user], (err, response) => {
        if (response[0]) {
            if (response[0].email === user) {
                db.set_new_pass([newPass, user], (err, response) => {
                    res.status(200).json('success')
                })
            }
        }
        else {
            res.status(200).json('error')
        }
    })
})

//this is made to simply check who the user is in case of page reload, etc.
app.get('/api/see_user', (req, res) => res.status(200).json(req.session.user))

//find out what the users first name is 
app.get('/api/get_name', (req, res) => {
    db.get_name(req.session.user, (err, response) => {
        err ?
        res.status(500).json(err) :
        res.status(200).json(response)
    })
})

//logout removes the user off of session
app.post('/api/logout', (req, res) => {
    req.session.user = null;
    res.status(200).json(req.session.user)
})

app.listen(port, () => console.log('Listening on port ' + port))