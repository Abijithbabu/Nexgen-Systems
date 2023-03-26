const User = require('../models/userModel')
const OTP = require('../middleware/otpValidation')
const bcrypt = require('bcrypt');

const loadRegister = async (req, res) => {
    try {
        res.render('users/login', { active: 1 })
    }catch (error) {console.log(error.message)}
}
const loginLoad = async (req, res) => {
    try {
        res.render('users/login', { active: 0 });
    }catch (error){ console.log(error.message)}  
}
let MNO
const verifyforget = async (req, res) => {
    try {
        const is_user = await User.findOne({ $or: [{ email: req.body.data }, { mobile: req.body.data }] })
        if (is_user) {
            MNO = is_user.mobile
            newOtp = OTP.sendMessage(MNO, res)
            console.log(newOtp);
            res.send({ otp: newOtp, user: is_user })
        }else {
            res.send({ user: false});
        }
    }catch (error){ console.log(error.message)}
}
const resetPassword = async (req, res) => {
    try {
            const spassword = await bcrypt.hash(req.body.password, 10);
            const userData = await User.updateOne({mobile: MNO}, { $set: { password: spassword } })
            console.log('password changed successfully');
            res.send({state:true})
    }catch (error){ console.log(error.message)}
}
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email, is_admin: 0 });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_verified) {
                    req.session.user_id = userData._id;
                    req.session.user = userData.name;
                    req.session.user1 = true
                    const status = await User.findByIdAndUpdate({ _id: userData._id }, { $set: { status: 1 } }); console.log(status);
                    res.send({message:false})
                } else {
                    res.send({ message: "You have been temporarily blocked by the Administrator , Please login after sometime"})
                }
            }else {
                res.send({ message: 'email or password is incorrect'})
            }
        }else {
            res.send({ message: 'invalid user credentials'})
        }
    }catch (error){ console.log(error.message)}
}
let user
const loadOtp = async (req, res) => {
    try {
        const is_user = await User.findOne({ $or: [{ email: req.body.email }, { mobile: req.body.phone }] })
        if (is_user) {
            res.send({otp: false})
        } else {
            const spassword = await bcrypt.hash(req.body.password, 10);
            user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.phone,
                password: spassword,
                is_admin: 0
            });
            newOtp = OTP.sendMessage(req.body.phone, res)
            console.log(newOtp);
            res.send({ otp: newOtp})
        }
    } catch (error) {console.log(error.message)}
}
const resendOtp = async (req, res) => {
    try {
        newOtp = OTP.sendMessage(MNO, res)
        console.log(newOtp);
        res.send({ otp: newOtp})
    } catch (error) {console.log(error.message)}
}
const verifyOtp = async (req, res) => {
    try {
        const userData = await user.save()
        if (userData) {
            req.session.user_id = userData._id;
            req.session.user = userData.name;
            req.session.user1 = true
            await User.findByIdAndUpdate({ _id: userData._id }, { $set: { status: 1 } })
            res.send({status:true})
        }else {
            res.send({status:false})        }
    } catch (error) {console.log(error.message)}
}
const userLogout = async (req, res) => {
    try {
        req.session.user1 = null;
        req.session.user = null;
        time = new Date().getHours() + ":" + new Date().getMinutes()
        const status = await User.findByIdAndUpdate({ _id: req.session.user_id }, { $set: { status: time } })
        req.session.user_id = null;
        res.redirect('/')
    }
    catch (error) {console.log(error.message)}
}
module.exports = {
    loadRegister,
    loginLoad,
    verifyforget,
    resetPassword,
    verifyLogin,
    userLogout,
    loadOtp,
    resendOtp,
    verifyOtp,
}
