const multer = require('multer');

// Define the storage configuration
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Create the Multer upload object
const upload = multer({ storage });

module.exports = upload;
