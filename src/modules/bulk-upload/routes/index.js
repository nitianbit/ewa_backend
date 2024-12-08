import express from 'express';
import multer from 'multer';
import { bulkUpload } from '../controllers/index.js';

const bulkUploadRouter = express.Router();
const fileFilter = (req, file, cb) => {

    const fileTypes = [
        'text/csv',
        //   'application/vnd.ms-excel',  
        //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  
    ];

    if (fileTypes.includes(file.mimetype)) {
        cb(null, true); // Accept
    } else {
        cb(new Error('Only CSV and Excel files are allowed!'), false); // Reject the file
    }
};


const upload = multer({ dest: 'uploads/', fileFilter });

bulkUploadRouter.post('/', upload.single('file'), bulkUpload);

export default bulkUploadRouter;
