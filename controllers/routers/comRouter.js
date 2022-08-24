let express = require('express');
let comRouter = express.Router({ mergeParams: true });
let { renderCreateCom, createCom } = require('../comController');
let multer = require('multer');
let storage  = require('../../config/cloudinaryConfig');
let upload = multer({ storage: storage });

comRouter.route('/create')
    .get(renderCreateCom)
    .post(upload.array('img'),createCom);

module.exports = comRouter;