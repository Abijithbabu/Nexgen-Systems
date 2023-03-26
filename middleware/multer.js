const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (params, file, callback) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/webp") {
      callback(null, true)
    } else {
      console.log('only jpg & png file supported !');
      callback(null, false)
    }
  }
});

module.exports = {
  upload
} 