const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid");

const { s3 } = require("../config/aws-config");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
};

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const extension = MIME_TYPES[file.mimetype];
            if (req.baseUrl == "/api/user") {
                cb(null, "profil_picture/" + uuid.v4() + "." + extension);
            } else if (req.baseUrl == "/api/post") {
                cb(null, "post_picture/" + uuid.v4() + "." + extension);
            } else {
                cb(null, "comment_picture/" + uuid.v4() + "." + extension);
            }
        },
    }),
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES.hasOwnProperty(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Invalid mime type"));
        }
    },
});

module.exports = upload.single("image");
