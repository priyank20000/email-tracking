require('dotenv').config();
const email = require("../model/email");
const EmailOpen = require("../model/emailOpen");
const nodemailer = require('nodemailer');
const path = require('path');

console.log('EMAIL_ADDRESS:', process.env.EMAIL_ADDRESS);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

exports.createEmail = async (req, res) => {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    console.log('Recipient Email:', to);

    try {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: to,
            subject: subject,
            html: `${html}
            <img src="http://localhost:3000/TrackEmail?email=${to}" >`
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Error sending email' });
            }

            await EmailOpen.create({
                from: process.env.EMAIL_ADDRESS,
                subject: subject,
                htm: html,
                status: 'new',
                email: to,
                openedAt: null,
                viewCount: 0
            });
                                        
            console.log('Email sent:', info.response);
            return res.status(200).json({ success: true, message: 'Email sent successfully' });
        });
    } catch (error) {
        console.error('Error creating email:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

exports.trackEmail = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).send('Missing email');
    }

    try {
        const emailOpen = await EmailOpen.findOne({ email });

        if (emailOpen) {
            let newStatus;
            if (emailOpen.status === 'new') {
                newStatus = 'opened';
            } else {
                newStatus = 'reopened';
            }

            await EmailOpen.updateOne(
                { email },
                { $set: { openedAt: new Date(), status: newStatus }, $inc: { viewCount: 1 } }
            );
        } else {
            await EmailOpen.create({
                email,
                status: 'opened',
                openedAt: new Date(),
                viewCount: 1
            });
        }

        res.setHeader('Content-Type', 'image/png');
        res.sendFile(path.join(__dirname, '../media/hilo.png'));

    } catch (error) {
        console.error('Error logging email open:', error);
        res.status(500).send('Internal Server Error');
    }
}
