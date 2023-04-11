const express = require('express');
const formData = require('express-form-data');
var bodyParser = require('body-parser')
const path = require('path');
const client = require('./connection');
const routes = require('./route') 
var cors = require('cors'); //Initialize Expressconst
const hdfs = require('./webHdfds') 
app = express();
app.use(cors());
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });
app.use(bodyParser.json({limit: '50mb'}))
app.use('/',routes)

// Init Middleware
app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: true }));
app.use(formData.parse())

client.ping(
  function(error) {
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Elasticsearch is connected');  
    }
  }
);


const PORT = process.env.PORT || 8081;


app.listen(PORT, () => console.group(`  Server Started On ${PORT}`));