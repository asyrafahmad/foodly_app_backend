const nodemailer = require('nodemailer');

async function sendEmail(userEmail, message) {
    // SMTP email sending logic here

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SMTP_AUTH_EMAIL,
            pass: process.env.SMTP_AUTH_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_AUTH_EMAIL,
        to: userEmail,
        subject: 'Foodly - OTP Verification Code',
        html:   `<h1> Foodly Email Verification </h1>
                <p>Your verification code is: </p>
                <h2 style="color: blue;"><b>${message}</b></h2>
                <p>Please enter this code on the verification page to complete you registration prcoess.</p>
                <p>If you did not request this email, please ignore this email.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully to', userEmail);
    } catch (error) {
        console.error('Error sending  OTP verification email:', error);
    } 
}

module.exports = sendEmail;