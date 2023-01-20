import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { APIResponse } from "mailersend/lib/services/request.service";
import { SendEmailInput } from "../generated";

export const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Mutation: {
    sendEmail: async (
      _: any,
      { input }: { input: SendEmailInput },
    ): Promise<APIResponse> => {
      const { sender, recipients, subject, body, htmlBody } = input;

      // if (recipients === null || recipients.length === 0) {
      //   throw new Error("Recipients can't be empty");
      // }

      const mailerSend = new MailerSend({
        apiKey: process.env.MAILER_API_TOKEN || "",
      });

      const sentFrom = new Sender(sender.email, sender.name);
      const newRecipients:Recipient[] =[]

      recipients.forEach((recipient) => {
        newRecipients.push(new Recipient(recipient.email, recipient.name))
      });

      const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(htmlBody || "")
      .setText(body || "");

      const sendEmailResponse = await mailerSend.email.send(emailParams);

      return sendEmailResponse;
    },
  },
};
