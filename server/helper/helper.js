const path = require('path');
var uuid = require('uuid').v4;


module.exports = {
    success: function (res, message = "", body = {}) {
        return res.status(200).json({
            success: true,
            status: 200,
            message: message,
            body: body
        });
    },
    failed: function (res, message = "", body = {}) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: message,
            body: body
        });
    },
    unauthorized: function (res, message = "", body = {}) {
        return res.status(401).json({
            success: false,
            status: 401,
            message: message,
            body: body
        });
    },
    fileUpload: (file, folder) => {
        if (file) {
            var extension = path.extname(file.name);
            var filename = uuid() + extension;
            file.mv(
                process.cwd() + `/public/images/` + filename,
                function (err) {
                    if (err) return err;
                }
            );
        }
        let url = `/images/${filename}`;
        return url;
    },
    generateTrackingId: () => {
        const prefix = "TRK";
        const random = Math.floor(1000000000 + Math.random() * 9000000000);
        return `${prefix}${random}`;
    }

}