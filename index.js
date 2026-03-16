const express = require('express');
const nodemailer = require('nodemailer'); 
const cors = require('cors');
require('dotenv').config(); 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

app.post('/api/inquiry', async (req, res) => {
  const { fullName, email, phone, productName, quantity, message } = req.body;

 const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use True for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  const mailOptionsAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Product Inquiry: ${productName}`,
    html: `
      <h2>New Website Inquiry</h2>
      <p><strong>Client full name:</strong> ${fullName}</p>
      <p><strong>Mobile No :</strong> ${phone}</p>
      <p><strong>Client Email:</strong> ${email}</p>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };
  
  const mailOptionsReceiver = {
    from: process.env.EMAIL_USER,
    to:email,
    replyTo: email,
    subject: `New Product Inquiry: ${productName}`,
    html: `
    <div style="background-color: #4161f1; padding: 50px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #eeeeab; border-top: 6px solid #f97316; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);">
        
        <div style="padding: 40px; text-align: center;">
            <h2 style="color: #f97316; margin-top: 0; font-size: 24px;">Hi  ${fullName} 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #000000; margin-bottom: 25px;">
                Thank you for contacting Royal ! We just wanted to let you know that we've successfully received your inquiry.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #000000; margin-bottom: 30px;">
                One of our team members will review it and connect with you within <span style="color: #f97316; font-weight: bold;">24 hours</span>. We look forward to speaking with you soon!
            </p>
            
            <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #810067; margin-bottom: 0;">
                Sent with love by the Royal Team
            </p>
        </div>
    </div>
</div>
      
    `,
  };

   try {
    await transporter.sendMail(mailOptionsAdmin);
    await transporter.sendMail(mailOptionsReceiver);
    res.status(200).send('Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send('Failed to send emails');
  }
});

app.get('/', (req, res) => {
  res.send('Server is running and ready to send emails!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});