import nodemailer from 'nodemailer';

interface SendMail {
  to: string;
  title: string;
  text: string;
  html: string;
}
async function main({ to, title, text, html }: SendMail) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: 'notice@ohbug.net',
      pass: '3oKXfbW9wTbYNvf6',
    },
  });

  const info = {
    from: 'Ohbug <notice@ohbug.net>',
    to,
    subject: title,
    text,
    html,
  };

  const verify = await transporter.verify();
  if (verify) {
    return await transporter.sendMail(info);
  }
}

export default main;
