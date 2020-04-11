
const Datastore = require('nedb');

//Table for courseworks
class DAO {
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

    //Add the entries to the Coursework table
    init() {
        this.db.insert({
           CourseworkField: 'Web Dev',
            MilestonesField: 'Whats next', 
            DesctiptionField: 'A breif Description'
        });
        console.log('new entry inserted');
    }//

    //Returns all entries from the coursework table
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
        })
    }

    //Adds a new entry to the courework table if given correct variables
    add(Coursework, Milestones, Description, _id){
        var entry = {
            Coursework : Coursework,
            Milestones : Milestones,
            Description : Description,
            _id:_id
        };

        this.db.insert(entry, function(err, doc){
            if (err){
                console.log("Can't insert product: ", Coursework + " " + Milestones);
            }
        });
    }

    //Removes all entries from the coursework table, only used during development.
    deleteAllEntries(){
        this.db.remove({}, { multi: true }, function (err, numRemoved) {});
    }
}

//Module exports
    module.exports = DAO;