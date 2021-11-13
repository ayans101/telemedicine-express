const User = require('../../models/user');
const env = require('../../config/environment');
const jwt = require('jsonwebtoken');
const { db } = require('../../config/environment');
const accountSid = "ACac7e7a383e47c6ea4a3014c64b88a914";
const authToken = "b43bbb70bd3764de595dd416cb546ae1";
const client = require('twilio')(accountSid, authToken);

module.exports.createSession = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "Invalid username or password",
                success: false
            });
        }

        return res.status(200).json({
            message: "Sign in successful, here is your token, please keep it safe",
            success: true,
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '1d'}),
                user: {
                    name: user.name,
                    email: user.email,
                    _id: user._id
                }
            }
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

module.exports.registerUser = function(req, res){

    if(req.body.password != req.body.confirm_password){
        return res.status(400).json({
            message: "The passwords entered do not match",
            success: false
        });
    }else{
        User.findOne({email: req.body.email}, function(err, user){
            let otp = 10000;
            if(!user){
                User.create(req.body, function(err, user){
                    return res.status(200).json({
                        message: "Sign up successful, here is your token, please keep it safe",
                        success: true,
                        data: {
                            token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '1d'}),
                            user: {
                                email: user.email,
                                userType: user.userType,
                                name: user.name,
                                age: user.age,
                                phoneNumber: user.phoneNumber,
                                _id: user._id,
                                otp: otp
                            }
                        }
                    });
                });
                client.messages
                    .create({body: otp, from: '+15017122661', to: user.phoneNumber})
                    .then(message => console.log(message.sid));
                //RETURN TO A PAGE FOR ENTERING THE OTP
            }else{
                return res.status(422).json({
                    message: "There already exists an account registered with this email address",
                    success: false
                });
            }
        });   
    }
}

module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }else{
            return res.status(200).json({
                message: "User Details",
                success: true,
                data: {
                    user: {
                        email: user.email,
                        userType: user.userType,
                        name: user.name,
                        age: user.age,
                        phoneNumber: user.phoneNumber,
                        _id: user._id
                    }
                }
            });
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


module.exports.verifyOTP = function (req, res) {
    models.users.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            //NO USER WITH GIVEN EMAIL
            console.log(err.message);
        }
        else {
            if (req.body.otp == user.otp) {
                //USER IS VALID, REDIRECT TO LOGIN
            }
            else {
                //USER IS NOT VALID, DELETING USER
                db.dropUser("user");
                return res.status(401).json({
                    message: "Wrong OTP",
                    success: false
                })
            }
        }
    })
}