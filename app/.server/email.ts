import { transporter } from "./db";

export async function sendEmail(
  emails: string[],
  subject: string,
  html: string
) {
  try {
    for (const email of emails) {
      console.log(
        `${process.env.COMPANY_NAME} <${process.env.EMAIL_USER}>`,
        email
      );
      const info = await transporter.sendMail({
        from: `${process.env.COMPANY_NAME} <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
      });
      console.log("Email sent: ", info.messageId);
    }
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
}
