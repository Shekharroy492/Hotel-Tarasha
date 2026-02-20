require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic rate limiter to reduce spam
const limiter = rateLimit({ windowMs: 60*1000, max: 20 });
app.use(limiter);

app.get('/', (req, res) => res.send({ ok: true, message: 'Contact server running' }));

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message, honeypot } = req.body;
    if (honeypot) return res.status(400).json({ ok: false, error: 'Spam detected' });
    if (!name || !email || !message) return res.status(400).json({ ok: false, error: 'Missing fields' });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Invalid email' });

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `Website Contact <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`
    };

    await transporter.sendMail(mailOptions);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Contact error', err);
    return res.status(500).json({ ok: false, error: 'Email send failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Contact server running on port ${PORT}`));
