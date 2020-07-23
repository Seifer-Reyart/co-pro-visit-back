function errorHandler(err, req, res) {
    console.log(err);
    if (typeof (err) === 'string' )
        return res.status(400).json({state: false, message: err});                //Api error
    if (err.name === 'UnauthorizedError')
        return res.status(401).json({state: false, message: 'Invalid Token'});    // jwt authentication error
    return res.status(500).json({state: false, message: err.message});            // Unhandled Error
}

module.exports = errorHandler;