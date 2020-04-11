const Datastore = require('nedb');

//Table for user accounts
class userTable{
    constructor(dbFilePath) {
        //run database as a file
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log("DB connected to file: ", dbFilePath);
        } else {
            //in memory 
            this.db = new Datastore();
        }
    }

    //Adds the information to the table. Used to confirm everything works.
    init(){
        this.db.insert({
            nameField: 'admin',
            emailField: 'admin@gmail.com',
            passwordField: 'password',
        });
        console.log('new entry inserted')
    }

    //Returns all entries from the user table.
    all() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, entries) {
                if (err) {
                    reject(err);
                    console.log('rejected');
                } else {
                    resolve(entries);
                    console.log('resolved');
                }
            });
        });
    }

    //Adds user information to the database as long as all input doesn't cause errors.
    add(name, email, password){
        var entry = {
            name: name,
            email: email,
            password: password,
        }

        this.db.insert(entry, function(err, doc){
            if(err){
                console.log("Can't create account");
            }
        });
    }

    //Deletes all entries in this table.
    deleteAllEntries(){
        this.db.remove({}, { multi: true }, function (err, numRemoved) {});
    }

    //Finds and returns the account information using the email field
    find(email){
        return new Promise((resolve, reject) => {
            this.db.find({emailField: email}, function (err, entry){
                if (err){
                    reject(err);
                    console.log('rejected');
                } else{
                    resolve(entry);
                    console.log('resolved');
                }
            });
        });
    }
}

module.exports = userTable;