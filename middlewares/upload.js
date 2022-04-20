const { GridFSBucket }  = require("mongodb");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require('dotenv');
dotenv.config()

const url = process.env.url;
mongoose.connection.on("connected",()=>{
    var db = mongoose.connections[0].db;
    exports.bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "newBucket"
      });
    
     console.log("bucket connected")
})

function extension(file) {
    if (file.mimetype == 'image/jpeg')
        return 'jpeg';
    else
        return 'png';
}

const storage = new GridFsStorage({
    url: url,
    file: async(req, file) => {
        
        let a = req.body.id;
      return new Promise((resolve, reject) => {

        const imgTypes = ['image/jpeg', 'image/png'];
        if (!imgTypes.includes(file.mimetype)) {
            reject("select appropriate type");
        }
        const filename = `${a}-dp.${extension(file)}`;
            const fileInfo = {
                filename: filename,
                bucketName: "newBucket"
            };
            resolve(fileInfo);
      });
    }
  });

exports.upload = multer({
    storage
  });




