require("dotenv").config();
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface IMailOptions {
  email: string;
  subject: string;
  template: string;
  data: {
    [key: string]: any;
  };
}

export const sendMail = async (options: IMailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { email, subject, template, data } = options;

    // Get the path to the email template file
    const templatePath = path.join(__dirname, `../mails`, template);

    // Render the email template with EJS
    const html = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: `"LMS Support" <${process.env.SMTP_MAIL}>`, // Customize the sender name
      to: email,
      subject,
      html,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
