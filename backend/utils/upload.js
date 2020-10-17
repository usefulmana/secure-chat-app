const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// Setting Up AWS
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: process.env.AWS_REGION,
});


// Filter File 
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
};

s3 = new aws.S3();

// Upload file
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET || "public-chattr",
    acl: "public-read",
    fileFilter: fileFilter,
    key: function (req, file, cb) {
      var newFileName = Date.now() + "-" + file.originalname;
      var fullPath = "avatar/" + newFileName;
      cb(null, fullPath);
    },
  }),
});


module.exports = { upload };
