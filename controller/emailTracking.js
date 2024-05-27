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

exports.index = async (req,res) => {
    const emails = await EmailOpen.find();
    res.render('index', { emails, message: '' });
}
exports.status = async (req,res) => {
    const emails = await EmailOpen.find();
    res.render('status', { emails, message: '' });
}


exports.createEmail = async (req, res) => {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    console.log('Recipient Email:', to);

    try {
        const randomId = Math.random().toString(36).substring(7);

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: to,
            subject: subject,
            html: `${html}
            <img src="https://email-tracking-v053.onrender.com/track?email=${randomId}" style="display:none;" >`
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                // return res.status(500).json({ success: false, message: 'Error sending email' });
                res.render('index', { emails: await EmailOpen.find(), message: 'Email failed to send' });
            }

            await EmailOpen.create({
                from: process.env.EMAIL_ADDRESS,
                subject: subject,
                html: html,
                to: to,
                email: randomId,
                status: 'new',
                openedAt: null,
                viewCount: 0
            });

            console.log('Email sent:', info.response);
            res.render('index', { emails: await EmailOpen.find(), message: 'Email sent successfully' });
            // return res.status(200).json({ success: true, message: 'Email sent successfully' });
        });
    } catch (error) {
        console.error('Error creating email:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

exports.getEmail = async (req, res) => {
    try {
        const emails = await EmailOpen.find();
        res.json(emails); // Send the emails as JSON response
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Internal server error' }); // Send an error response if something goes wrong
    }
}


exports.trackEmail = async (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(path.join(__dirname, '../media/hideImage.png'));


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
        

    } catch (error) {
        console.error('Error logging email open:', error);
        res.status(500).send('Internal Server Error');
    }
}


exports.emailDelet = async (req, res) => {
    const emailId = req.params.id;
    try {
        // Delete email from the database
        await EmailOpen.findByIdAndDelete(emailId);
        res.redirect('/status'); // Redirect to the home page or any other page
    } catch (error) {
        console.error('Error deleting email:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
