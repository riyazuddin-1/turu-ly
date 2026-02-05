import transporter from "../config/email.config.js";

class EmailService {
  constructor(defaultFrom) {
    this.transporter = transporter;
    this.defaultFrom = defaultFrom;
  }

  async sendMail({ to, subject, text, html, from, cc, bcc, attachments = [] }) {
    try {
      const mailOptions = {
        from: from || this.defaultFrom,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      console.error("Email send failed:", error);
      return {
        success: false,
        error,
      };
    }
  }

  async sendTemplate({ to, subject, template, variables = {}, from }) {
    try {
      let html = template;

      for (const [key, value] of Object.entries(variables)) {
        html = html.replaceAll(`{{${key}}}`, value);
      }

      return await this.sendMail({
        to,
        subject,
        html,
        from,
      });
    } catch (error) {
      console.error("Template email failed:", error);
      return {
        success: false,
        error,
      };
    }
  }
}

export default EmailService;
