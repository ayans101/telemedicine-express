const User = require('../../models/user');

// TODO
module.exports.createSession = function(req, res){
    return res.status(200).json({
        success: true,
        message: "Hello World"
    });
}

// TODO
module.exports.registerUser = function(req, res){
    return res.status(200).json({
        success: true,
        message: "Hello World"
    });
}