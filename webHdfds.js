const WebHDFS = require("webhdfs");

var axios = require("axios")

let url = "http://20.110.179.222";

let port = 50070; //change here if you are using different port

let dir_path = "user/cloudera/sap"; 

let path = "/webhdfs/v1/" + dir_path + "?op=LISTSTATUS&user.name=cloudera";

let full_url = url+':'+port+path;

let hdfs = WebHDFS.createClient({

    user: "cloudera",
    
    host: "20.110.179.222",
    
    port: 50070, //change here if you are using different port
    
    path: "webhdfs/v1/user/cloudera/demo"
    
    }); 

module.exports = {hdfs, full_url} ;