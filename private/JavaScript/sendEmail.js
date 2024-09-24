const nodemailer = require(`nodemailer`)();

// Create transporter object using your email provider's settings
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'joshuaharris1107@outlook.com',
        pass: 'BestServedChilled03'
    }
});

// Email content
const mailOptions = {
    from: 'joshuaharris003@outlook.com',
    to: 'joshuaharris1107@outlook.com',
    subject: 'Quotation',
    text: 'Good day Joshua, please find attached your quotation from www.dctsolar.co.za',
    html: `<h2>Good day Joshua,</h2>
<p>Please find attached your quotation from <a href="https://www.dctsolar.co.za">DCT Solar</a>.</p>
<p>We hope this quotation meets your needs. If you have any questions or require further information, please don't hesitate to contact us.</p>
<p>Sincerely,</p>
<p>The DCT Solar Team</p>`
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if(error){
        console.log(error);
    }else{
        console.log('Email sent: ' + info.response);
    }
});