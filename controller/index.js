//Imports the libraries
var express = require('express'),
    mustache = require('mustache-express'),
    path = require('path')
var app = express();
app.set('port', process.env.PORT || 3000);


//Imports the body parser library
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
})); 

//imports the bcrypt library
var bcrypt = require('bcrypt');

//Creates instance for the product table in the database
var DAO = require('../model/nedb');
//Creates a file for the information
var dbFile = 'database.nedb.db';
//Runs the table in embedded mode
let dao = new DAO(dbFile);
//Initializes Coursewrork table, only used during testing.
//dao.init();
//dao.deleteAllEntries();
//dao.all().then((Coursework) => console.log(Coursework));

//Creates instance for the user table in the database
var userTABLE = require('../model/userdb');
//Creates a file for the information
var dbUserFile = 'userTable.nedb.db';
//Runs the table in embedded mode
let userdb = new userTABLE(dbUserFile);
//Initializes coursework table, only used during testing.
//userTab.init();
//userTab.deleteAllEntries();
//userTab.all().then((userAccounts) => console.log(userAccounts));


//Handles mustache
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.resolve(__dirname, '../view'));


//Main page handler. Passes the list of all database entries to the mustache as "entries"
app.get('/viewCoursework', function(req,res){
    dao.all()
    .then((list)=>{
        res.render("index",{'entries': list});
        console.log(list)
    })
    .catch((err)=>{
        res.status(200);
        res.type('text/plain');
        res.send('An error has occured while loading the entries from database');
        console.log('Error: '), 
        console.log(JSON.stringify(err))
    });
})

//New Entry page handler
app.get('/newEntry', function(req,res){
    res.render("newEntry");
});


app.get('/sharedLink', function(req, res){
    userdb.all()
   
    .then((list)=>{
        res.render("sharedLink",{'Hi': list});
        console.log(list)
    })
});

    app.get('/showMe', function(req, res){
    dao.all()
    .then((list)=>{
        res.render("showMe",{'entries': list});
        console.log(list)
    })

 });

    

app.get('/deleteCoursework', function(req,res){
    userdb.all()
    .then((list)=>{
    res.render("deleteCoursework",{'Hi': list})
    dao.deleteAllEntries();
   
   
});
});

//Handles the add new coursework function.
app.post('/newEntry', function(req,res){
    if (!req.body.Coursework|| !req.body.Milestones|| !req.body.Description ){
        res.status(400).send("Entries must have a Coursework Name , Milestones and a Description!");
        return;
    }
//adds the new coursework to the database
    dao.add(req.body.Coursework, req.body.Milestones, req.body.Description);
    console.log("A new entry has been added to the Coursework table");
    res.redirect('/viewCoursework');
});

app.post('/editEntry', function(req,res){
    if (!req.body.Coursework|| !req.body.Milestones|| !req.body.Description ){
        res.status(400).send("Entries must have a Coursework Name , Milestones and a Description!");
        return;
    }
//adds the new coursework to the database
    dao.deleteAllEntries();
    dao.add(req.body.Coursework, req.body.Milestones, req.body.Description);
    console.log("A new entry has been added to the Coursework table");
    res.redirect('/viewCoursework');
});

//Home page handler
app.get('/', function(req, res){
    userdb.all()
    .then((list)=>{
        res.render("home",{'Hi': list});
        console.log(list)
    })
.catch((err)=>{
    res.status(200);
    res.type('text/plain');
    res.send('An error has occured while loading the entries from database');
    console.log('Error: '), 
    console.log(JSON.stringify(err))
   });
   });

//editCoursework page
app.get('/editEntry', function(req, res){
    dao.all()
    .then((list)=>{
        res.render("editEntry",{'entries': list});
        console.log(list)
    })
    .catch((err)=>{
        res.status(200);
        res.type('text/plain');
        res.send('An error has occured while loading the entries from database');
        console.log('Error: '), 
        console.log(JSON.stringify(err))
    });
})

//Login page extention
app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function(req, res){

    userdb.find(req.body.emailField)
    .then((user) => {
        console.log(user);
        bcrypt.compare(req.body.password, user.password, function(){
            if (req.body.password != user.password)
          
            res.redirect('/') 
        });
    
    })

    //This is for if there is an issue retreiving the log on inforamation
    .catch((err)=>{
        res.status(200);
        res.type('text/plain');
        res.send('An error has occured while loading the user account information from database');
        console.log('Error: '), 
        console.log(JSON.stringify(err))
    });
});


//Log out function
app.get('/logout', function(req, res){
    res.redirect('login');
});

//Register page extention
app.get('/register', function(req, res){
    res.render('register');
});

//The user can create a hashed password meaning that the passsword is securley saved
app.post('/register', function(req, res){
    if(!req.body.name || !req.body.email || !req.body.password){
        res.status(400).send("You must fill all the fields");
        return;
    }
    dao.deleteAllEntries();
    userdb.deleteAllEntries();
    var hashedPassword = bcrypt.hashSync(req.body.password, 15);
    userdb.add(req.body.name, req.body.email, hashedPassword);
    console.log("A new entry has been added to the user table");
 
    res.redirect('/login');
});

//404 response for an incorrect link
app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

//500 response for a server issue
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('Please Register First');
    res.redirect('/login');
});

//for the app starting, showing in the console
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');

});

