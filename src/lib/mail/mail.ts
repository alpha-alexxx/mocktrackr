// lib/mail.ts
import nodemailer from 'nodemailer';

type MailOptions = {
    from: string; // "Name <email@example.com>"
    to: string; // comma-separated or array
    subject: string;
    html?: string;
    text?: string;
};

type SMTPConfig = {
    host: string;
    port: number;
    secure: boolean; // true for port 465, false for 587
    auth: {
        user: string;
        pass: string;
    };
};
/**
 * Setup for SMTP
 */
const config = {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!), // string → number
    secure: false,
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASSWORD!
    }
};

/**
 * Send an email using any SMTP-compatible service
 */

export async function sendMail(mail: MailOptions): Promise<{ success: boolean; error?: string }> {
    try {
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.auth.user,
                pass: config.auth.pass
            }
        });

        await transporter.sendMail({
            from: mail.from,
            to: mail.to,

            subject: mail.subject,
            html: mail.html,
            text: mail.text
        });

        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
