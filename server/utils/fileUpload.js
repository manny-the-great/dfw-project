const path = require('path');
const fs = require('fs');

module.exports = {
    fileUpload: async (imgFile) => {
        const fileUrl = `${Date.now()}-${imgFile.name}`;
        const imagesDir = path.join(__dirname, '../public/images');

        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        const uploadPath = path.join(imagesDir, fileUrl);

        await imgFile.mv(uploadPath, (err) => {
            if (err) {
                throw err;
            }
        });

        return fileUrl;
    }
};
