const multer = require('multer');
const path = require('path');
const fs = require('fs');

const pastaUploads = path.join(__dirname, '..', '..', 'uploads');

if(!fs.existsSync(pastaUploads)){
    fs.mkdirSync(pastaUploads, {recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, pastaUploads),
    filename: (req, file, cb) => {
        cb(null, `usuario_${req.usuarioId}_${Date.now()}.jpg`);
    }
});

const uploadFoto = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const tiposValidos = ['image/jpeg', 'image/png', 'image/webp'];
        if (tiposValidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de imagem inválido'));
        }
    }
});

module.exports = uploadFoto;