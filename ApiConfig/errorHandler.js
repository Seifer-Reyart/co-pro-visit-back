function errorHandler(err, req, res, next) {
    console.log(err);
    if (typeof(err) === 'string' )
        return res.status(400).json({state: false, message: err});                //Api error
    else if (err.name === 'UnauthorizedError')
        return res.status(401).json({state: false, message: 'Invalid Token'});    // jwt authentication error
    else
        return res.status(500).json({state: false, message: err.message});        // Unhandled Error
}

module.exports = errorHandler;