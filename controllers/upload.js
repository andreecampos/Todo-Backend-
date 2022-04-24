const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        console.log(file);
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage: storage})

exports.upload = upload.array('myfile')

exports.uploadFile = (req, res) =>{

}