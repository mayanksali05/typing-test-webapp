const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if email credentials exist
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[DEV MODE] Email to ${options.to}: ${options.subject} - ${options.text}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
