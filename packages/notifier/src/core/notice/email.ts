import nodemailer from 'nodemailer';

interface SendMail {
  auth: {
    user: string;
    pass: string;
  };
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
    from: `Ohbug <${auth.user}>`,
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
