// server/config/cspConfig.js

function setCSP(req, res, next) {
    res.setHeader("Content-Security-Policy", 
        "default-src 'self'; " +           // อนุญาตโหลด resource จากโดเมนของตัวเอง
        "script-src 'self'; " +            // อนุญาตให้ใช้ script เฉพาะที่มาจากโดเมนของตัวเอง
        "style-src 'self'; " +             // อนุญาตให้โหลดสไตล์ชีทจากโดเมนของตัวเอง
        "img-src 'self' data:; " +         // อนุญาตโหลดภาพจากโดเมนของตัวเองและจาก data URIs
        "font-src 'self'; "                // อนุญาตให้โหลดฟอนต์จากโดเมนของตัวเอง
    );
    next();
}

module.exports = setCSP;
