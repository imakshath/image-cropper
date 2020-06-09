const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

const cors = require('cors');

const PORT = process.env.PORT || 3001;
const SIZE_LIMIT = process.env.SIZE_LIMIT || (5 * 1024 * 1024);
const MAX_FILES = process.env.MAX_FILES || 4;

app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const publicPath =  path.join(__dirname, '..', 'public', 'images');
        cb(null, publicPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const otherFilters = {
    limits: {
        files: MAX_FILES, // allow up to 5 files per request,
        fieldSize: SIZE_LIMIT // 2 MB (max file size)
    },
    fileFilter: (req, file, cb) => {
        // allow images only
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image are allowed.'), false);
        }
        cb(null, true);
    }
};

const upload = multer({ storage, fileFilter: otherFilters.fileFilter, limits: otherFilters.limits }).array('files', 10);

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).send(res.req.files);
    });
});

app.listen(PORT, function() {
    console.log(`Server app running on port ${PORT}`);
});
