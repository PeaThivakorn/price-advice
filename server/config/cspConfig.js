// server/config/cspConfig.js
function setCSP(req, res, next) {
    res.setHeader("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'sha256-<hash-value>'; " +
        "style-src 'self'; " +
        "img-src 'self' data:; " +
        "font-src 'self'; "
      );
      
}
module.exports = setCSP;
