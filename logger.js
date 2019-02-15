let logging = function (req, res, next) {
    console.log("Logging...");
    next();
}

module.exports = logging;