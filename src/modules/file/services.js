import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import settings from '../../../settings.js'
import { createDirIfNotExist, now } from '../../utils/helper.js';

function fieldsToArray(fields) {
    const fieldsArray = [];
    for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
            const value = fields[key];
            fieldsArray.push({ [key]: value?.[0] ?? "" });
        }
    }
    return fieldsArray;
}

function parseForm(req) {
    return new Promise((resolve, reject) => {
        const form = formidable({});

        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err);
            } else {
                const parsedFields = fieldsToArray(fields);
                resolve({ fields: parsedFields, files });

            }
        });
    });
}


export const parseFormFields = async (req) => {
    const { fields, files } = await parseForm(req);
    const body = fields.reduce((acc, obj) => {
        const key = Object.keys(obj)[0];
        return { ...acc, [key]: obj[key] };
    }, {});

    return { body, files }
}

//It will save files to a particular repo module and return the file paths
export const saveFilesToDirectory = (files, module,record_id) => {
    const filePaths = [];

    for (let file of files.pic) {
        const fileExt = path.extname(file?.originalFilename)
        const fileData = fs.readFileSync(file.filepath);

        const fileModulePath = `/files/${module}/${record_id}/${now()}-${file.newFilename}${fileExt}`

        createDirIfNotExist(`${settings.PROJECT_DIR}${fileModulePath}`);
        fs.writeFileSync(`${settings.PROJECT_DIR}${fileModulePath}`, fileData);
        filePaths.push(`file/static${fileModulePath}`);

        // fs.promises.unlink(file.filepath).then(() => console.log("profile tmp file deleted")).catch(err => console.log({ err }))
    }
    return filePaths;
}

export const removeFile = (fileStaticPath) => {
    const [, file] = fileStaticPath.split("api/o/static/")
    const filePath = `${settings.PROJECT_DIR}/${file}`;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
}