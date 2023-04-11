const { Client } = require('@elastic/elasticsearch'); 
var client = new Client({ 
  node: 'http://elastic:XybmMIjhmvO1VsOPSx6U@10.8.0.4:9200',  
  log: 'trace'}); 

  module.exports = client;