import nodemailer from 'nodemailer';

interface SendMail {
  auth: any;
  to: string;
  title: string;
  text: string;
  html: string;
}
async function main({ auth, to, title, text, html }: SendMail) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,
    auth,
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
