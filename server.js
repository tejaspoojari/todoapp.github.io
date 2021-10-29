let express = require('express');
let mongodb = require('mongodb').MongoClient;
let ObjectId  = require('mongodb').ObjectId;

let ourApp = express();
let dbName = 'trial'  
let db;

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
};

ourApp.use(express.static('public'));
let connectString = 'mongodb://tejasDb:jtYNnSmnyD7q4WCy@cluster0-shard-00-00.w7hgt.mongodb.net:27017,cluster0-shard-00-01.w7hgt.mongodb.net:27017,cluster0-shard-00-02.w7hgt.mongodb.net:27017/trial?ssl=true&replicaSet=atlas-he0k6o-shard-0&authSource=admin&retryWrites=true&w=majority'
mongodb.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    if (err) {
        console.log(`err ${err}`);
    } else {
    db = client.db(dbName);
    ourApp.listen(port), () => { console.log('Your server and database are connected, reload your page')
    }
    }; 
})

ourApp.use(express.json());
ourApp.use(express.urlencoded({ extended: false }));

ourApp.get('/',function(req, res){

    db.collection('ItemList').find().toArray(function(err, items){
        if (err) {
            console.log('Not able to convert mongodb formatted data into a javascript Array')
        } else {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App!!</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action = '/submit' method = "POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name = 'item' autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button  class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
        </ul>
        
      </div>
    
    <script>
    let item =  ${JSON.stringify(items)};
    </script>
  
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="browser.js"></script>
    </body>
    </html>`)
        };
    });
});

// Insert

ourApp.post('/submit',function(req, res){
  db.collection('ItemList').insertOne({text: req.body.text}, function(err, info){
    if(err){
      console.log(err);
    }else{
    // res.json(info.ops[0]);
    console.log(req.body.text);
    res.json({ _id: info.insertedId.toString(), text: req.body.text })
    };
  })
})

//Update by edit
ourApp.post('/update-item', function(req, res){
    db.collection('ItemList').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set : {text: req.body.text}}, function(){
        res.send('Success');
    })
})

//Delete by delete button
ourApp.post('/delete-item', function(req, res){
  db.collection('ItemList').deleteOne({_id: new ObjectId(req.body.id)}, function(){
    res.send('Success');
  })
})