'use strict';

// [START gae_node_request_example]

// const cors = require('cors');
const express = require('express');
const app = express();

// app.use(cors());
//
// var path = require('path');
// app.use(express.static(path.join(__dirname,'dist/stockSearchRouter')));
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    next();
})

const mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost:27017/moodme');
const uri = "mongodb+srv://lishaxu:XuL015937@cluster0.risbl.mongodb.net/moodme?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => console.log('mongoose connect successfully！'))
mongoose.connection.on('error', console.error)

mongoose.Promise = global.Promise;
// const Restaurant = require('./restaurant');
const Schema = new mongoose.Schema({
  _id: String,
  address: {
    building: Number,
    street: String,
  },
  cuisine: String,
  grades: [{
    date: Date,
    grade: String,
    score: Number,
  }],
  name: String,
  restaurant_id: String
});

const Restaurant = mongoose.model("restaurant", Schema, 'restaurant');
module.exports = Restaurant;

app.get('/', function (req, res,next) {
  let query = req.query;
  var search;
  if(query.name != null && query.name.length !== 0) {
      search = {name: query.name};
      Restaurant.find(search).then(function (restaurant) {
          // console.log(restaurant);
          res.send(restaurant);
      }).catch(next);
  }
  else if((query.picked == null || query.picked === "null") && (query.num_record == null || query.num_record.length === 0)){
      Restaurant.find({}).then(function (restaurant) {
          // console.log(restaurant);
          res.send(restaurant);
      }).catch(next);
  }

  else{
      search = []
      if(query.picked !== "null"){
          if(query.picked === "cuisine"){
              search.push({$sort:{cuisine: 1}});
          }
          if(query.picked === "avgscore"){

              search.push({$unwind: "$grades"});
              search.push({$group:{_id:{name:"$name", restaurant_id:"$restaurant_id", address:"$address", cuisine:"$cuisine"}, avgscore:{$avg: "$grades.score"}}});
              search.push({$sort:{avgscore: -1}});
              search.push({"$project":{
                      restaurant_id:"$_id.restaurant_id",
                      address:"$_id.address",
                      cuisine:"$_id.cuisine",
                      name:"$_id.name",
                      avgscore:"$avgscore"
                  }});
          }
          if(query.picked === "popular"){
              search.push({$unwind: "$grades"});
              search.push({$group:{_id:{name:"$name", restaurant_id:"$restaurant_id", address:"$address", cuisine:"$cuisine"},numgrade:{$sum: 1}}});
              search.push({$sort:{numgrade: -1}});
              search.push({"$project":{
                      restaurant_id:"$_id.restaurant_id",
                      address:"$_id.address",
                      cuisine:"$_id.cuisine",
                      name:"$_id.name",
                      numgrade:"$numgrade"
                  }})
          }
      }
      if(query.num_record != null && query.num_record.length !== 0){
          var num_record = query.num_record - '0';
          if(query.num_pages == null || query.num_pages.length===0) {
              query.num_pages = '1';
          }
          var num_pages = query.num_pages - '0'
          search.push({$limit: num_record * num_pages });
          search.push({$skip: (num_pages - 1)*num_record})
      }

      Restaurant.aggregate(search).then(function (restaurant){
          // console.log(restaurant);
          res.send(restaurant);
      }).catch(next);

  }
});
// app.get('*',((req, res)=>{
//     res.sendFile(path.join(__dirname,"./dist/index.html"));
// }));
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
