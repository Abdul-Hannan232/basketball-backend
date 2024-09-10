const multer = require('multer');
const path = require('path');
const {RandomString } =require('../utils/RandomString')
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload');
    },

    filename: (req, file, cb) => {
    
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[:.-]/g, '').slice(0, 14);    // Format the date and time to YYYYMMDD-HHMMSS
    const ext = path.extname(file.originalname);
    const uniqueName = `/${formattedDate+RandomString(30)}${ext}`;
    cb(null, uniqueName);
    },
});

// File type filter (optional, if you want to allow specific file types like images only)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        console.log("errrrrr---------")
        const err = new Error("Only PNG or JPG images, maximum size 2MB, are allowed.");
        err.status = 400; // Custom status code
        return cb(err);
     }
};

// Limits the file size to 5MB
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});


const uploadImage =async (uniqueName)=>{
    try{
    const filePath = path.join(__dirname, './upload', uniqueName);       
     }catch(err){ throw new Error(err.message)}
}


const deleteFile = (fileName) => {
    const directoryPath = path.join(__dirname, '../upload'); // Path to your folder
    const filePath = path.join(directoryPath, fileName);
  
    // Check if the file exists first
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File does not exist:', filePath);
        return;
      }
      // If the file exists, proceed to delete it
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
          return;
        }
        console.log('File deleted successfully:', filePath);
      });
    });
  };


module.exports = {
    upload,
    uploadImage,
    deleteFile
}
