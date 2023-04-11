const hdfs = require('./webHdfds')
const url = require('./webHdfds')
var request = require("request");  
require('log-timestamp');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const client = require('./connection');



router.get('/pipeline',(req,res)=>{
  client.ingest.putPipeline({
  id: 'FileAttachment',
  body: {
    description : "Extract attachment information",
    processors : [
    {
      attachment : {
        field : "data",
        properties: [ "content", "title", "language", "content_type", "content_length"]
      }
    }
  ]
  },
});

  return res.json("pipline created")
})

router.post('/indexFiles',(req,res)=>{
  var data = req.body.base64Data;
  var filename = req.body.filename;
  var resp = client.index({
    index: 'processedfiles',
    pipeline: 'FileAttachment',
    body: {
        data:data,
        title: filename,
    },
  },(error, response) => {
    if(error) {
      console.log('DOH! Something went wrong!');
    } else {
      return res.json(response.result);
    }
  });
  return res.json(resp);
})

router.post('/search',async(req,res)=>{
  var query = req.body.query;

  const result = await client.search({
    index: 'processedfiles',
    query: {
      multi_match : {
          query: query, 
          type: "cross_fields",
          fields: [ "title", "attachment.content" ] 
        }
      }
  })
  console.log(result.hits.hits)
  return res.json(result.hits)
})

router.get("/listDir",(req,res)=>{
  console.log(url)
  request.get({url:url}, function(error, response, body) {

        if (!error && response.statusCode == 200) {
    
            console.log(".. response body..", body);
    
            let jsonStr = JSON.parse(body);
    
            let myObj = jsonStr.FileStatuses.FileStatus;
    
            let objLength = Object.entries(myObj).length;
    
                     console.log("..Number of files in the folder: ", objLength);
    return res.json(objLength)
    
        } else {
             console.log(error)
             console.log("..error occured!..");
    
        }
    
    }  )
    return res.json("null")
})

router.get("/hdfsRead",(req,res)=>{
  let remoteFileStream = hdfs.hdfs.createReadStream("/demohdfs3.txt")

remoteFileStream.on("error", function onError(err) { //handles error while read

    // Do something with the error

  console.log("...error: ", err);

});



let dataStream = [];

remoteFileStream.on("data", function onChunk(chunk) { //on read success

    // Do something with the data chunk 

 dataStream.push(chunk);

 console.log('..chunk..',chunk);

});

remoteFileStream.on("finish", function onFinish() { //on read finish

  console.log('..on finish..');

  console.log('..file data..',dataStream);

  return res.json({data:dataStream})

});


})

router.post('/OCRFileIndexing',(req,res)=>{
  var fileURL  = req.body.fileURL;
  var filename = req.body.filename;
  var index = req.body.index;
  var fileContent = req.body.fileContent;
  var fileClassification = req.body.fileClassification;
  var fileUploadedDate = req.body.fileUploadedDate;
  var fileUploadedBy = req.body.fileUploadedBy;
  var fileBase64 = req.body.fileBase64;
  var fileSize = req.body.fileSize;

  var resp = client.index({
    index: index,
    
    body: {
        filename: filename,
        fileURL: fileURL,
        fileContent: fileContent, 
        fileClassification: fileClassification,
        fileUploadedDate: fileUploadedDate,
        fileUploadedBy : fileUploadedBy,
        fileBase64 : fileBase64,
        fileSize : fileSize
    },
  },(error, response) => {
    if(error) {
      console.log('DOH! Something went wrong!');
    } else {
      return res.json(response.result);
    }
  });
  return res.json(resp);
})


router.post('/OCRFilesearch',async(req,res)=>{
  var query = req.body.query;
  var index = req.body.index;
  const result = await client.search({
    index: index,
    size:100,
    query: {
      multi_match : {
          query: query, 
          type: "cross_fields",
          fields: [ "filename", "fileContent" ] 
        }
      }
  })
  // console.log(result.hits.hits)
  return res.json(result.hits)
})


router.post('/getAllFiles',async(req,res)=>{
  var index = req.body.index;

  const result = await client.search({
    index: index,
    size:100,
    query: {
      match_all: {}
  }
  })
  // console.log(result.hits.hits)
  return res.json(result.hits)
})

router.delete('/deleteFile',async(req,res)=>{
  var index = req.body.index;
  var id = req.body.id;
  
  
  const result = await client.delete({
    index:index,
    id:id
  },(error, response) => {
    if(error) {
      console.log('DOH! Something went wrong!');
    } else {
      return res.json(response.result);
    }
  })
  
  return res.json(result)

})
module.exports = router;