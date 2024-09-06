const multer = require('multer');
const path = require('path');
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
    const uniqueName = `/${formattedDate}${ext}`;
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
        const err = new Error("Only png or jpg, max size 2mb allowed");
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

const assignUniqueName=(imageFile)=>{

     try{
        const now = new Date();
        const formattedDate = now.toISOString().replace(/[:.-]/g, '').slice(0, 14); // Format the date
        const ext = path.extname(imageFile.originalname); // Get the extension of the file
        const uniqueName = `/${formattedDate}${ext}`; // Combine to create unique name
        
        // Set image file name in the request body before saving the user
        return uniqueName;
     }catch(err){ throw new Error(err.message)}
}

const uploadImage =async (uniqueName)=>{
    try{
    const filePath = path.join(__dirname, './uploads', uniqueName);       
     }catch(err){ throw new Error(err.message)}
}
module.exports = {
    upload,
    assignUniqueName,
    uploadImage
}
