const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get('/api/contact', (req, res) => {
  res.status(200).json({ message: 'Contact API is running! Use POST to send messages.' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const data = await resend.emails.send({
      from: `${name} <onboarding@resend.dev>`, // Resend's required default sender for free accounts
      to: process.env.MY_EMAIL, // Your personal email address where you want to receive messages
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    console.log('Email sent successfully:', data);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});