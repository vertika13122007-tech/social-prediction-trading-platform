const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User = require("../../db/schemas/User");
const OTP = require("../../db/schemas/OTP");
const generateOTP = require("../utils/generateOTP");
const { sendOTPEmail, sendForgotPasswordEmail } = require("../services/emailService");
const Transactions = require("../../db/schemas/Transaction");
const walletUtils = require("../utils/walletUtils");
const { publishEvent } = require("../utils/eventService");

const registerUser = async (req,resp) =>{
    try{
        const {name,email,password} = req.body;
        const role = req.body.role ? req.body.role.toUpperCase() : "USER";

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
            role,
            expiresAt: new Date(Date.now() + 5*60*1000)
        });

        await sendOTPEmail(userName, email, otp, role);

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
            password: hashPassword,
            role: otpRecord.role || "USER"
        });

        await walletUtils.creditWallet(
            user._id,
            1000,
            "CREDIT",
            "Welcome bonus"
        );
        
        await OTP.deleteOne({_id : otpRecord._id});

        await publishEvent({
            user: user._id,
            type:"system",
            title:"Welcome to Live Market 🎉",
            message:"Your account has been created successfully."
        });

        await publishEvent({
            user:user._id,
            type:"payouts",
            title:"Welcome Bonus Credited",
            message:"1000 virtual coins has been added to you wallet."
        });

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


const loginUser = async (req,resp) => {
    try{
        const {email,password} = req.body;
        const requestedRole = req.body.role ? req.body.role.toUpperCase() : "USER";

        if( !email || !password ){
            return resp.status(400).json({
                message:"Email and password is required"
            });
        }

        const userRecord = await User.findOne({email});

        if( !userRecord ){
            return resp.status(404).json({
                message:"User not found"
            });
        }

        // Validate role match
        const userRole = (userRecord.role || "USER").toUpperCase();
        if (userRole !== requestedRole) {
            return resp.status(403).json({
                message: requestedRole === "ADMIN" 
                    ? "Access denied. This account is not registered as an Admin." 
                    : "Access denied. This account is registered as an Admin."
            });
        }

        const isMatch = await bcrypt.compare(password,userRecord.password);

        if( !isMatch ){
            return resp.status(401).json({
                message:"Password is incorrect"
            });
        }

        const token = jwt.sign({
                id: userRecord._id,
                role: userRecord.role,
                email: userRecord.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2d"
            }
        );

        return resp.status(200).json({
            message:"Login successful",
            token,
            user:{
                id: userRecord._id,
                name: userRecord.name,
                email:userRecord.email,
                role: userRecord.role
            }
        });

    }catch(error){
        console.error(error);
        return resp.status(501).json({
            message:"Login failed"
        });
    }
};

const forgotPassword = async (req, resp) => {
    try {
        const { email } = req.body;
        const requestedRole = req.body.role ? req.body.role.toUpperCase() : null;

        if (!email) {
            return resp.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(404).json({ message: "No user found with this email" });
        }

        const userRole = (user.role || "USER").toUpperCase();
        if (requestedRole && userRole !== requestedRole) {
            return resp.status(403).json({
                message: requestedRole === "ADMIN" 
                    ? "Access denied. This account is not an Admin account." 
                    : "Access denied. This account is an Admin account."
            });
        }

        const otp = generateOTP();

        await OTP.deleteMany({ email });

        await OTP.create({
            name: user.name,
            email,
            password: "FORGOT_PASSWORD_PLACEHOLDER",
            otp,
            role: userRole,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendForgotPasswordEmail(user.name, email, otp, userRole);

        return resp.status(200).json({
            message: "Password reset OTP sent to your email"
        });
    } catch (error) {
        console.error(error);
        return resp.status(500).json({ message: "Failed to send reset email" });
    }
};

const resetPassword = async (req, resp) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return resp.status(400).json({ message: "Email, OTP and new password are required" });
        }

        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) {
            return resp.status(404).json({ message: "OTP not found or expired" });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return resp.status(400).json({ message: "OTP has expired" });
        }

        if (otpRecord.otp !== otp) {
            return resp.status(400).json({ message: "Invalid OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        await OTP.deleteOne({ _id: otpRecord._id });

        return resp.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return resp.status(500).json({ message: "Failed to reset password" });
    }
};

module.exports = { registerUser, verifyOTP, loginUser, forgotPassword, resetPassword };