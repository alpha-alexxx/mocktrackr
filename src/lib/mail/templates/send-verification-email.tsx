import { siteConfig } from '@/lib/site/site-config';

import type { User } from 'better-auth';

export const GetVerificationEmailTemplate = (user: User, url: string) => {
    const year = new Date().getFullYear();

    const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', sans-serif; color: #333333;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" width="600" style="background: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); overflow: hidden;">
          <!-- Accent Bar -->
          <tr>
            <td style="height: 5px; background-color: #007bff;"></td>
          </tr>
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px;">
              <img src="${siteConfig.url}/${siteConfig.logo}" alt="${siteConfig.name}" width="120" style="display: block;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h1 style="font-size: 24px; margin: 0 0 20px; color: #222;">Email Verification</h1>
              <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                Hi ${user.name || 'there'}, 👋<br/>
                Welcome to <strong>${siteConfig.name}</strong> – your smart partner in mock test performance tracking.
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
                To complete your registration and start using all features securely, please verify your email address:
              </p>
              <!-- CTA Button -->
              <p style="margin: 30px 0; text-align: center;">
                <a href="${url}" target="_blank" style="
                  display: inline-block;
                  background-color: #007bff;
                  color: #ffffff;
                  padding: 14px 28px;
                  text-decoration: none;
                  font-size: 16px;
                  font-weight: 600;
                  border-radius: 6px;">
                  🔐 Verify Email
                </a>
              </p>
              <!-- Fallback link -->
              <p style="font-size: 14px; line-height: 1.6; color: #666;">
                If the button above doesn't work, paste this link into your browser:
              </p>
              <p style="font-size: 14px; word-break: break-word;">
                <a href="${url}" style="color: #007bff;">${url}</a>
              </p>
              <strong>This link will expire in 10 Minutes.</strong>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />
              <p style="font-size: 14px; color: #666;">
                <strong>Not you?</strong> If you didn’t sign up on <strong>${siteConfig.name}</strong>, just ignore this email.
              </p>
              <p style="font-size: 14px; color: #666;">
                Need help or saw suspicious activity? Contact us at:
                <a href="mailto:${siteConfig.supportEmail}" style="color: #007bff;">${siteConfig.supportEmail}</a>
              </p>
              <p style="font-size: 14px; margin-top: 30px;">
                Thanks for choosing <strong>${siteConfig.name}</strong>.<br/>– The ${siteConfig.name} Team
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 13px; color: #999;">
              <div style="margin-bottom: 10px;">
                <a href="${siteConfig.footer.links.socials[0]}" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="20" /></a>
                <a href="${siteConfig.footer.links.socials[1]}" style="margin: 0 8px;"><img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" width="20" /></a>
              </div>
              <div style="margin-bottom: 6px;">
                <a href="${siteConfig.url}/terms" style="margin: 0 10px; color: #666; text-decoration: none;">Terms</a> |
                <a href="${siteConfig.url}/privacy" style="margin: 0 10px; color: #666; text-decoration: none;">Privacy</a> |
                <a href="mailto:${siteConfig.supportEmail}" style="margin: 0 10px; color: #666; text-decoration: none;">Support</a>
              </div>
              <div style="margin-top: 6px;">&copy; ${year} ${siteConfig.name}. All rights reserved.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    return template;
};
