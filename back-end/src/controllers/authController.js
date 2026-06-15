const bcrypt = require('bcryptjs');

const User = require("../../db/schemas/User");
const OTP = require("../../db/schemas/OTP");
const generateOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../services/emailService");

const registerUser = async (req,resp) =>{
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return resp.status(400).json({
                message:"All fields are required",
            });
        }
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return resp.status(400).json({
                message:"User already exists",
            });
        }
        
        const userName = req.body.name;
        const otp = generateOTP();

        await OTP.deleteMany({email});

        await OTP.create({
            name,
            email,
            password,
            otp,
            expiresAt: new Date(Date.now() + 5*60*1000)
        });

        await sendOTPEmail(userName,email,otp);

        return resp.status(200).json({
            message:"OTP sent successfully",
        });
    }catch(error){
        console.error(error);
        resp.status(500).json({
            message: "Server Error"
        });
    }
};


const verifyOTP = async (req,resp) => {
    try{
        const {email,otp} = req.body;

        if( !email || !otp ){
            return resp.status(400).json({
                message:"Email and otp is required"
            });
        }

        const otpRecord = await OTP.findOne({email});

        if( !otpRecord ){
            return resp.status(404).json({
                message:"OTP not found"
            });
        }

        if( otpRecord.expiresAt <  new Date() ){
            await OTP.deleteOne({ _id: otpRecord._id});

            return resp.status(404).json({
                message:"OTP has expired"
            });
        }

        if( otpRecord.otp !== otp ){
            return resp.status(400).json({
                message:"Invalid OTP"
            });
        }

        const hashPassword = await bcrypt.hash(otpRecord.password,10);

        const user = await User.create({
            name: otpRecord.name,
            email: otpRecord.email,
            password: otpRecord.hashPassword
        });

        await OTP.deleteOne({_id : otpRecord._id});

        return resp.status(201).json({
            message: "Account has been verified",
            userId: user._id,
        });

    }catch(error){
        console.error(error);
        return resp.status(500).json({
            message:"Something is wrong with email verification!!"
        });
    }
};

module.exports = {registerUser,verifyOTP};