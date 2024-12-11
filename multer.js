import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Utility to ensure the folder exists
export const ensureFolderExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

const createStorage = (folder) => {
    const folderPath = path.join(__dirname, `./public/${folder}`);
    ensureFolderExists(folderPath);

    return multer.diskStorage({
        destination: (_, __, cb) => cb(null, folderPath),
        filename: (_, file, cb) =>
            cb(null, `${file.originalname}`),
    });
};

export const expertImageUpload = multer({
    storage: createStorage('images/expert'),
});
export const candidateImageUpload = multer({
    storage: createStorage('images/candidate'),
});
export const resumeUpload = multer({
    storage: createStorage('resumes/temp'),
});
