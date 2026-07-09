const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
    },

});

const sendOTPEmail = async (userName,email,otp) => {
    try{
        await transporter.sendMail({
        from: `"LiveMarket" <${process.env.EMAIL_USER}`,
        to: email,
        subject:"Verify your Account",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <title>Verify Your Email</title>
            </head>

            <body style="margin:0;padding:0;background:#f3f7fb;font-family:Arial,Helvetica,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
            <td align="center">

            <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:18px;overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);">

            <tr>
            <td
            style="
            background:linear-gradient(135deg,#2563eb,#0ea5e9);
            padding:35px;
            text-align:center;
            color:white;
            ">

            <h1 style="margin:0;font-size:42px;font-weight:700;">
            📈 LIVE MARKET
            </h1>

            <p style="margin-top:10px;font-size:19px;opacity:0.95;">
            Prediction Trading Platform
            </p>

            </td>
            </tr>

            <tr>
            <td style="padding:45px;">

            <h2
            style="
            margin-top:0;
            color:#1e293b;
            font-size:34px;
            font-weight:700;
            ">
            Verify Your Email
            </h2>

            <p style="color:#475569;font-size:18px;line-height:1.8;">

            Hello <strong>${userName}</strong>,

            <br><br>

            Thank you for joining <strong>Live Market</strong>.

            Use the verification code below to complete your registration.

            </p>

            <div
            style="
            margin:35px 0;
            text-align:center;
            ">

            <div
            style="
            display:inline-block;
            padding:18px 40px;
            font-size:52px;
            font-weight:800;
            letter-spacing:12px;
            letter-spacing:16px;
            padding:22px 50px;
            background:#eff6ff;
            color:#2563eb;
            border-radius:18px;
            border:1px solid #bfdbfe;
            box-shadow:0 10px 25px rgba(37,99,235,.12);
            ">

            ${otp}

            </div>

            </div>

            <p
            style="
            text-align:center;
            color:#64748b;
            font-size:17px;
            ">

            This OTP is valid for
            <strong>5 minutes</strong>.

            </p>

            <hr
            style="
            margin:35px 0;
            border:none;
            border-top:1px solid #e2e8f0;
            ">

            <p
            style="
            font-size:14px;
            color:#94a3b8;
            line-height:1.7;
            ">

            If you didn't create an account, you can safely ignore this email.

            </p>

            </td>
            </tr>

            <tr>

            <td
            style="
            background:#f8fafc;
            padding:22px;
            text-align:center;
            font-size:15px;
            color:#64748b;
            ">

            © 2026 Live Market

            <br>

            Prediction Trading Platform

            </td>

            </tr>

            </table>

            </td>
            </tr>
            </table>

            </body>
            </html>
        `
        });

        console.log("Email sent");
        
    }catch(error){
        console.error(error);
        throw error;
    }
};

module.exports = sendOTPEmail;