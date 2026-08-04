const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

console.dir(brevo.transactionalEmails.sendTransacEmail, { depth: null });

const sendOTPEmail = async (userName, email, otp, role = "USER") => {
    try {
        const isAdmin = role.toUpperCase() === "ADMIN";
        const subject = isAdmin ? "Verify Your Admin Account - Live Market" : "Verify your Account";
        const title = isAdmin ? "Verify Admin Account" : "Verify Your Email";
        const subtitle = isAdmin ? "Administrator Registration Verification" : "Prediction Trading Platform";
        const messageBody = isAdmin
            ? `Hello Administrator <strong>${userName}</strong>,<br><br>Thank you for joining <strong>Live Market</strong> as an Administrator. Use the verification code below to complete your admin account registration.`
            : `Hello <strong>${userName}</strong>,<br><br>Thank you for joining <strong>Live Market</strong>. Use the verification code below to complete your registration.`;

        
        const html =`
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <title>${title}</title>
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
            background:${isAdmin ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "linear-gradient(135deg,#2563eb,#0ea5e9)"};
            padding:35px;
            text-align:center;
            color:white;
            ">

            <h1 style="margin:0;font-size:42px;font-weight:700;">
            📈 LIVE MARKET
            </h1>

            <p style="margin-top:10px;font-size:19px;opacity:0.95;">
            ${subtitle}
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
            ${title}
            </h2>

            <p style="color:#475569;font-size:18px;line-height:1.8;">

            ${messageBody}

            </p>

            <div
            style="
            margin:35px 0;
            text-align:center;
            ">

            <div
            style="
            display:inline-block;
            font-size:52px;
            font-weight:800;
            letter-spacing:16px;
            padding:22px 50px;
            background:${isAdmin ? "#f3e8ff" : "#eff6ff"};
            color:${isAdmin ? "#7c3aed" : "#2563eb"};
            border-radius:18px;
            border:1px solid ${isAdmin ? "#ddd6fe" : "#bfdbfe"};
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

        try {
            const response = await brevo.transactionalEmails.sendTransacEmail({
                sender: {
                    email: process.env.EMAIL_FROM,
                    name: "LiveMarket",
                },
                to: [
                    {
                        email,
                        name: userName,
                    },
                ],
                subject,
                htmlContent: html,
            });

            console.log(response);
        } catch (err) {
            console.error(err);
        }

        console.log("Email sent");
        
    }catch(error){
        console.error(error);
        throw error;
    }
};

const sendForgotPasswordEmail = async (userName, email, otp, role = "USER") => {
    try{
        const isAdmin = role.toUpperCase() === "ADMIN";
        const subject = isAdmin ? "Admin Password Reset - Live Market" : "Reset Your Password - Live Market";
        const title = isAdmin ? "Reset Admin Password" : "Reset Your Password";
        const subtitle = isAdmin ? "Administrator Account Recovery" : "Prediction Trading Platform";
        const messageBody = isAdmin
            ? `Hello Administrator <strong>${userName}</strong>,<br><br>We received a password reset request for your Administrator account at <strong>Live Market</strong>. Use the verification code below to reset your admin password.`
            : `Hello <strong>${userName}</strong>,<br><br>We received a request to reset your password for <strong>Live Market</strong>. Use the verification code below to reset your password.`;

        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <title>${title}</title>
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
            background:${isAdmin ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "linear-gradient(135deg,#2563eb,#0ea5e9)"};
            padding:35px;
            text-align:center;
            color:white;
            ">

            <h1 style="margin:0;font-size:42px;font-weight:700;">
            📈 LIVE MARKET
            </h1>

            <p style="margin-top:10px;font-size:19px;opacity:0.95;">
            ${subtitle}
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
            ${title}
            </h2>

            <p style="color:#475569;font-size:18px;line-height:1.8;">

            ${messageBody}

            </p>

            <div
            style="
            margin:35px 0;
            text-align:center;
            ">

            <div
            style="
            display:inline-block;
            font-size:52px;
            font-weight:800;
            letter-spacing:16px;
            padding:22px 50px;
            background:${isAdmin ? "#f3e8ff" : "#eff6ff"};
            color:${isAdmin ? "#7c3aed" : "#2563eb"};
            border-radius:18px;
            border:1px solid ${isAdmin ? "#ddd6fe" : "#bfdbfe"};
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

            If you didn't request a password reset, you can safely ignore this email.

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
        try {
            const response = await brevo.transactionalEmails.sendTransacEmail({
                sender: {
                    email: process.env.EMAIL_FROM,
                    name: "LiveMarket",
                },
                to: [
                    {
                        email,
                        name: userName,
                    },
                ],
                subject,
                htmlContent: html,
            });

            console.log("BREVO SUCCESS");
            console.dir(response, { depth: null });

            console.log(response);
        } catch (error) {
            console.error("========== BREVO ERROR ==========");

            console.error("Message:", error.message);

            console.error("Name:", error.name);

            console.error("Status:", error.statusCode || error.status);

            console.error("Response:");

            console.dir(error, { depth: null });

            throw error;
        }

        console.log("Forgot password email sent");
        
    }catch(error){
        console.error(error);
        throw error;
    }
};

module.exports = { sendOTPEmail, sendForgotPasswordEmail };