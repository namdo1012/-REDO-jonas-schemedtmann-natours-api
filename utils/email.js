const nodemailer = require('nodemailer');

module.exports = class Email {
  // user: user's infor: email, name,.. to send mail to
  // url: href in email template, direct user to specific route
  constructor(user, url) {
    this.from = `NAM DO ${process.env.EMAIL_FROM}`;
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
  }

  createNewTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Send mail with SENDGRID

      return 1;
    }

    // Else if NODE_ENV === development
    return (transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ashlee16@ethereal.email',
        pass: 'mbQ6PdbRSX2ZyxRFx7',
      },
    }));
  }

  sendEmail(template, subject) {
    const mailOptions = {
      from: this.from, // sender address
      to: this.to, // list of receivers
      subject, // Subject line
      text: options.message, // plain text body
    };
  
    let info = await transporter.sendMail(mailOptions);
  }

  sendWelcome() {
    return sendEmail('welcome', 'Welcome to the Natours family!');
  }
};

// const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  // This app use mailtrap catch mail service, another service can be used is https://ethereal.email/
  // ETHEREAL SERVICE
  // const transporter = nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   auth: {
  //     user: 'ashlee16@ethereal.email',
  //     pass: 'mbQ6PdbRSX2ZyxRFx7',
  //   },
  // });
  // MAILTRAP SERVICE
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL.PASSWORD,
  //   },
  // });

  // send mail with defined transport object
  // const mailOptions = {
  //   from: '"NAM DO" <nam@example.com>', // sender address
  //   to: options.email, // list of receivers
  //   subject: options.subject, // Subject line
  //   text: options.message, // plain text body
  // };

  // let info = await transporter.sendMail(mailOptions);
// };

module.exports = sendEmail;
