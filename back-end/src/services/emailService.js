const {Resend} = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (userName,email,otp) => {
    try{
        const response = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject:"Verify your Account",
        html:`<h1>Social Prediction Trading Platform</h1>
            <h2>Greetings ${userName} !!</h2>
            <p>OTP for verfiying your account is : </p>
            <h2><b>${otp}</b></h2>
            <p>This OTP will expires in 10 minutes.</p>
        `
        });

        console.log("EMAIL_RESP:",response);
        
    }catch(error){
        console.error(error);
        throw error;
    }
};

module.exports = sendOTPEmail;