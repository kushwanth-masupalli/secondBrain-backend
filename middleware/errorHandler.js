const errorHandler = (err, req, res, next) => {
    
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);

    switch (statusCode) {
        case 500:
            res.json({ message: "Internal Server Error by middleware"});
            break;
        case 404:
            res.json({ message: "Not Found" });
            break;
        default:
            res.json({ message: err.message || "Unknown Error" });
    }
};


module.exports = errorHandler;