const User = require('../../models/user');
const Otp = require('../../models/otp');
const env = require('../../config/environment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const client = require('twilio')(env.twilio_account_sid, env.twilio_auth_token);

module.exports.login = async function(req, res){
    try{
        let user = await User.findOne({email: req.body.email});
        let isPasswordMatched = await bcrypt.compare(req.body.password, user.password);
        if(!user || !isPasswordMatched){
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

module.exports.register = async function(req, res){
    try {
        let user = await User.findOne({email: req.body.email});
        if(user) {
            return res.status(422).json({
                message: "There already exists an account registered with this email address",
                success: false
            });
        }
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        await User.create(req.body, function(err, user){
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
                    }
                }
            });
        });

    } catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
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

module.exports.generateOTP = async function (req, res) {
    try {
        let phoneNumber = req.body.phoneNumber;
        let otp = Math.floor(Math.random() * 900000) + 100000;
        let new_otp = new Otp({ phone: phoneNumber, otp: otp });
        new_otp.save (function (err) {
            if (err) {
                //error handling
            };
        });
        client.messages
            .create({body: otp, from: '+15017122661', to: phoneNumber})
            .then(message => console.log(message.sid));

    } catch {
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

module.exports.verifyOTP = function (req, res) {
    models.Otp.findOne({phoneNumber: req.body.phone}, function (err, otp) {
        if (err) {
            //NO USER WITH GIVEN PHONE NUMBER
            console.log(err.message);
        }
        else {
            if (req.body.otp == otp.otp) {
                //USER IS VALID, REDIRECT TO LOGIN
            }
            else {
                //USER IS NOT VALID, DELETING USER
                const removeUser = async() => {
                    let func = await otp.remove();
                }
                return res.status(401).json({
                    message: "Wrong OTP",
                    success: false
                })
            }
        }
    })
}