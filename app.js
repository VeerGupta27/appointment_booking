const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve HTML

// Email Configuration (Use your Gmail & App Password)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',  // Replace with your Gmail
        pass: 'your-app-password'  // Generate App Password from Google
    }
});

// Save responses & send email
app.post('/save-response', (req, res) => {
    const { responses } = req.body;
    const responseText = responses.join("\n");

    // Save to file
    fs.writeFileSync('responses.txt', responseText);

    // Send email silently
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'veer.kaishava@gmail.com',
        subject: 'Appointment Confirmation',
        text: responseText
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.send('Response saved & email sent successfully!');
    });
});

// Serve HTML Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
